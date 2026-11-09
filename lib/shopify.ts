import crypto from "node:crypto";

export function normalizeShop(raw: string | null) {
  const shop = (raw || "").trim().toLowerCase().replace(/^https?:\/\//, "").replace(/\/.*$/, "");
  return /^[a-z0-9][a-z0-9-]*\.myshopify\.com$/.test(shop) ? shop : null;
}

export function verifyShopifyHmac(url: URL) {
  const secret = process.env.SHOPIFY_API_SECRET;
  const supplied = url.searchParams.get("hmac");
  if (!secret || !supplied) return false;
  const message = [...url.searchParams.entries()]
    .filter(([key]) => key !== "hmac" && key !== "signature")
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${value}`)
    .join("&");
  const expected = crypto.createHmac("sha256", secret).update(message).digest("hex");
  const actualBuffer = Buffer.from(supplied, "hex");
  const expectedBuffer = Buffer.from(expected, "hex");
  return actualBuffer.length === expectedBuffer.length && crypto.timingSafeEqual(actualBuffer, expectedBuffer);
}
