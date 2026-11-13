import { NextRequest, NextResponse } from "next/server";
import { encryptSecret } from "@/lib/crypto";
import { db } from "@/lib/db";
import { normalizeShop, verifyShopifyHmac } from "@/lib/shopify";

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
    body: new URLSearchParams({ client_id: clientId, client_secret: clientSecret, code }),
    cache: "no-store"
  });
  if (!tokenResponse.ok) return NextResponse.json({ error: "Shopify token exchange failed" }, { status: 502 });
  const token = await tokenResponse.json() as {
    access_token: string;
    scope: string;
  };
  if (!token.access_token) {
    return NextResponse.json({ error: "Shopify did not return an offline access token" }, { status: 502 });
  }
  const sql = db();
  await sql`
    insert into shops (
      lead_id, shop_domain, access_token_encrypted, refresh_token_encrypted,
      access_token_expires_at, refresh_token_expires_at, scopes,
      connection_status, connected_at, updated_at
    )
    values (
      ${leadId}, ${shop}, ${encryptSecret(token.access_token)}, ${null},
      ${null}, ${null},
      ${token.scope}, 'connected', now(), now()
    )
    on conflict (shop_domain) do update set
      lead_id = coalesce(excluded.lead_id, shops.lead_id),
      access_token_encrypted = excluded.access_token_encrypted,
      refresh_token_encrypted = null,
      access_token_expires_at = null,
      refresh_token_expires_at = null,
      scopes = excluded.scopes,
      connection_status = 'connected',
      connected_at = now(),
      updated_at = now()
  `;

  const leadQuery = leadId ? `&lead=${encodeURIComponent(leadId)}` : "";
  const response = NextResponse.redirect(new URL(`/app?shop=${encodeURIComponent(shop)}${leadQuery}`, request.url));
  response.cookies.delete("shopify_oauth_state");
  response.cookies.delete("shopify_lead_id");
  return response;
}
