import Link from "next/link";
import { FunnelShell } from "@/components/FunnelShell";

export default async function CreateShopifyPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await searchParams;
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) if (typeof value === "string") query.set(key, value);
  return (
    <FunnelShell>
      <h1>Create your Shopify store</h1>
      <p>Open your Shopify account in a new tab. Once Shopify finishes creating the store, return here and connect its permanent <strong>.myshopify.com</strong> address.</p>
      <a className="btn" href="/go/shopify" target="_blank" rel="noopener noreferrer">Create my Shopify account</a>
      <Link className="btn secondary" href={`/connect?${query.toString()}`}>I created my store — continue</Link>
    </FunnelShell>
  );
}
