import { NextRequest, NextResponse } from "next/server";
import { encryptSecret } from "@/lib/crypto";
import { db } from "@/lib/db";
import { normalizeShop, verifyShopifyHmac } from "@/lib/shopify";
import { adminGraphql } from "@/lib/shopify-admin";

export async function GET(request: NextRequest) {
  const shop = normalizeShop(request.nextUrl.searchParams.get("shop"));
  const code = request.nextUrl.searchParams.get("code");
  const state = request.nextUrl.searchParams.get("state");
  const stateCookie = request.cookies.get("shopify_oauth_state")?.value;
  const leadCookie = request.cookies.get("shopify_lead_id")?.value || "";
  const leadId = /^[0-9a-f-]{36}$/i.test(leadCookie) ? leadCookie : null;
  if (!shop || !code || !state || state !== stateCookie || !verifyShopifyHmac(request.nextUrl)) {
    return NextResponse.json({ error: "Invalid Shopify authorization response" }, { status: 400 });
  }
  const clientId = process.env.SHOPIFY_API_KEY;
  const clientSecret = process.env.SHOPIFY_API_SECRET;
  if (!clientId || !clientSecret) return NextResponse.json({ error: "Shopify app is not configured" }, { status: 503 });

  const tokenResponse = await fetch(`https://${shop}/admin/oauth/access_token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded", Accept: "application/json" },
    body: new URLSearchParams({ client_id: clientId, client_secret: clientSecret, code, expiring: "1" }),
    cache: "no-store"
  });
  if (!tokenResponse.ok) return NextResponse.json({ error: "Shopify token exchange failed" }, { status: 502 });
  const token = await tokenResponse.json() as {
    access_token: string;
    scope: string;
    expires_in: number;
    refresh_token: string;
    refresh_token_expires_in: number;
  };
  if (!token.access_token || !token.refresh_token || !token.expires_in) {
    return NextResponse.json({ error: "Shopify did not return expiring offline credentials" }, { status: 502 });
  }
  const sql = db();
  await sql`
    insert into shops (
      lead_id, shop_domain, access_token_encrypted, refresh_token_encrypted,
      access_token_expires_at, refresh_token_expires_at, scopes,
      connection_status, connected_at, updated_at
    )
    values (
      ${leadId}, ${shop}, ${encryptSecret(token.access_token)}, ${encryptSecret(token.refresh_token)},
      now() + (${token.expires_in} * interval '1 second'),
      now() + (${token.refresh_token_expires_in} * interval '1 second'),
      ${token.scope}, 'connected', now(), now()
    )
    on conflict (shop_domain) do update set
      lead_id = coalesce(excluded.lead_id, shops.lead_id),
      access_token_encrypted = excluded.access_token_encrypted,
      refresh_token_encrypted = excluded.refresh_token_encrypted,
      access_token_expires_at = excluded.access_token_expires_at,
      refresh_token_expires_at = excluded.refresh_token_expires_at,
      scopes = excluded.scopes,
      connection_status = 'connected',
      connected_at = now(),
      updated_at = now()
  `;

  const appUrl = process.env.APP_URL?.replace(/\/$/, "");
  if (appUrl) {
    try {
      await adminGraphql<{
        webhookSubscriptionCreate: { userErrors: Array<{ message: string }> }
      }>({ domain: shop, accessToken: token.access_token }, `
        mutation RegisterUninstallWebhook($topic: WebhookSubscriptionTopic!, $subscription: WebhookSubscriptionInput!) {
          webhookSubscriptionCreate(topic: $topic, webhookSubscription: $subscription) {
            userErrors { message }
          }
        }
      `, {
        topic: "APP_UNINSTALLED",
        subscription: { uri: `${appUrl}/api/webhooks/app-uninstalled`, format: "JSON" }
      });
    } catch (error) {
      console.error("Unable to register Shopify uninstall webhook", error);
    }
  }

  const leadQuery = leadId ? `&lead=${encodeURIComponent(leadId)}` : "";
  const response = NextResponse.redirect(new URL(`/upgrade?shop=${encodeURIComponent(shop)}${leadQuery}`, request.url));
  response.cookies.delete("shopify_oauth_state");
  response.cookies.delete("shopify_lead_id");
  return response;
}
