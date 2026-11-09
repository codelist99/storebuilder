import Link from "next/link";
import { FunnelShell } from "@/components/FunnelShell";

export default function PublishPage() {
  return (
    <FunnelShell>
      <h1>Publish Store</h1>
      <p>Shopify protects new storefronts with a password until they are ready. Open Shopify, remove storefront password protection, save, and then return here.</p>
      <a className="btn" href="https://admin.shopify.com" target="_blank" rel="noopener noreferrer">Access Shopify to publish your store</a>
      <Link className="btn secondary" href="/ready">Done — my store is published</Link>
    </FunnelShell>
  );
}
