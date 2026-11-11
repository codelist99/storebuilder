import Link from "next/link";
import { FunnelShell } from "@/components/FunnelShell";

export default function CreateShopifyPage() {
  return (
    <FunnelShell>
      <h1>Create your Shopify store</h1>
      <p>Open your Shopify account in a new tab. Once Shopify finishes creating the store, return here and connect its permanent <strong>.myshopify.com</strong> address.</p>
      <a className="btn" href="/go/shopify" target="_blank" rel="noopener noreferrer">Create my Shopify account</a>
      <Link className="btn secondary" href="/connect">I created my store — continue</Link>
    </FunnelShell>
  );
}
