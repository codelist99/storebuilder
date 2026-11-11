import crypto from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { normalizeShop } from "@/lib/shopify";

export async function GET(request: NextRequest) {
  const shop = normalizeShop(request.nextUrl.searchParams.get("shop"));
  const lead = request.nextUrl.searchParams.get("lead") || "";
  const clientId = process.env.SHOPIFY_API_KEY;
  const appUrl = process.env.APP_URL;
  if (!shop) return NextResponse.redirect(new URL("/connect?error=invalid", request.url));
  if (!clientId || !appUrl) return NextResponse.json({ error: "Shopify app is not configured" }, { status: 503 });

  const state = crypto.randomBytes(24).toString("base64url");
  const scopes = process.env.SHOPIFY_SCOPES || "read_products,write_products,read_themes,write_themes,read_content,write_content";
  const callback = `${appUrl.replace(/\/$/, "")}/api/shopify/callback`;
  const authorize = new URL(`https://${shop}/admin/oauth/authorize`);
  authorize.searchParams.set("client_id", clientId);
  authorize.searchParams.set("scope", scopes);
  authorize.searchParams.set("redirect_uri", callback);
  authorize.searchParams.set("state", state);

  const response = NextResponse.redirect(authorize);
  response.cookies.set("shopify_oauth_state", state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 600,
    path: "/"
  });
  if (/^[0-9a-f-]{36}$/i.test(lead)) response.cookies.set("shopify_lead_id", lead, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 600,
    path: "/"
  });
  return response;
}
