import { NextResponse } from "next/server";

const FALLBACK_AFFILIATE_URL = "https://shopify.pxf.io/DWNOya";

export function GET() {
  const destination = process.env.SHOPIFY_SIGNUP_URL || FALLBACK_AFFILIATE_URL;
  return NextResponse.redirect(destination, 307);
}
