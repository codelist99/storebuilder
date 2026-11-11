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
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ client_id: clientId, client_secret: clientSecret, code }),
    cache: "no-store"
  });
  if (!tokenResponse.ok) return NextResponse.json({ error: "Shopify token exchange failed" }, { status: 502 });
  const token = await tokenResponse.json() as { access_token: string; scope: string };
  const sql = db();
  await sql`
    insert into shops (lead_id, shop_domain, access_token_encrypted, scopes, connection_status, connected_at, updated_at)
    values (${leadId}, ${shop}, ${encryptSecret(token.access_token)}, ${token.scope}, 'connected', now(), now())
    on conflict (shop_domain) do update set
      lead_id = coalesce(excluded.lead_id, shops.lead_id),
      access_token_encrypted = excluded.access_token_encrypted,
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

  const response = NextResponse.redirect(new URL(`/upgrade?shop=${encodeURIComponent(shop)}`, request.url));
  response.cookies.delete("shopify_oauth_state");
  response.cookies.delete("shopify_lead_id");
  return response;
}
