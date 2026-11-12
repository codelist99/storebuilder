import { FunnelShell } from "@/components/FunnelShell";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ shop?: string }>;
}) {
  const { shop = "" } = await searchParams;
  const storeHandle = shop.endsWith(".myshopify.com")
    ? shop.slice(0, -".myshopify.com".length)
    : "";
  const adminUrl = storeHandle
    ? `https://admin.shopify.com/store/${storeHandle}`
    : "https://admin.shopify.com";

  return (
    <FunnelShell step="Final Step">
      <div className="success">
        <h1>🚀 Let&apos;s Launch Your Store Together</h1>
        <p>
          Your BuildMyStore setup is complete. Check your Shopify admin to review
          products, supplier settings and storefront details before taking the
          store live.
        </p>
        <a className="btn" href={adminUrl} target="_blank" rel="noreferrer">
          Open Shopify Admin
        </a>
      </div>
    </FunnelShell>
  );
}
