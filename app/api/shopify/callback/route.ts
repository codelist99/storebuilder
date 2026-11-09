import { NextRequest, NextResponse } from "next/server";
import { encryptSecret } from "@/lib/crypto";
import { db } from "@/lib/db";
import { normalizeShop, verifyShopifyHmac } from "@/lib/shopify";

export async function GET(request: NextRequest) {
  const shop = normalizeShop(request.nextUrl.searchParams.get("shop"));
  const code = request.nextUrl.searchParams.get("code");
  const state = request.nextUrl.searchParams.get("state");
  const stateCookie = request.cookies.get("shopify_oauth_state")?.value;
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
    insert into shops (shop_domain, access_token_encrypted, scopes, connection_status, connected_at, updated_at)
    values (${shop}, ${encryptSecret(token.access_token)}, ${token.scope}, 'connected', now(), now())
    on conflict (shop_domain) do update set
      access_token_encrypted = excluded.access_token_encrypted,
      scopes = excluded.scopes,
      connection_status = 'connected',
      connected_at = now(),
      updated_at = now()
  `;

  const response = NextResponse.redirect(new URL(`/upgrade?shop=${encodeURIComponent(shop)}`, request.url));
  response.cookies.delete("shopify_oauth_state");
  return response;
}
