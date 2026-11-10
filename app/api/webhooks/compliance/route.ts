import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { normalizeShop, verifyShopifyWebhook } from "@/lib/shopify";

export async function POST(request: NextRequest) {
  const rawBody = await request.text();
  if (!verifyShopifyWebhook(rawBody, request.headers.get("x-shopify-hmac-sha256"))) {
    return NextResponse.json({ error: "Invalid webhook" }, { status: 401 });
  }
  const topic = request.headers.get("x-shopify-topic");
  const payload = JSON.parse(rawBody) as { shop_domain?: string };
  const shop = normalizeShop(payload.shop_domain || request.headers.get("x-shopify-shop-domain"));
  if (topic === "shop/redact" && shop) {
    const sql = db();
    await sql`delete from shops where shop_domain = ${shop}`;
  }
  return new NextResponse(null, { status: 200 });
}
