import Link from "next/link";
import { FunnelShell } from "@/components/FunnelShell";

export default async function PublishPage({ searchParams }: { searchParams: Promise<{ shop?: string }> }) {
  const { shop = "" } = await searchParams;
  const adminUrl = shop
    ? `https://admin.shopify.com/store/${shop.replace(".myshopify.com", "")}/online_store/preferences`
    : "https://admin.shopify.com";
  return (
    <FunnelShell>
      <h1>Publish Store</h1>
      <p>Shopify protects new storefronts with a password until they are ready. Open Shopify, remove storefront password protection, save, and then return here.</p>
      <a className="btn" href={adminUrl} target="_blank" rel="noopener noreferrer">Access Shopify to publish your store</a>
      <Link className="btn secondary" href={`/ready?shop=${encodeURIComponent(shop)}`}>Done — my store is published</Link>
    </FunnelShell>
  );
}
