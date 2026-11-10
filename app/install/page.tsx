import { FunnelShell } from "@/components/FunnelShell";

export default async function InstallPage({ searchParams }: { searchParams: Promise<{ shop?: string }> }) {
  const { shop = "" } = await searchParams;
  return (
    <FunnelShell>
      <h1>Connect BuildMyStore</h1>
      <h2>It’s time to install the BuildMyStore app</h2>
      <p>The Shopify authorization screen will show exactly what the builder can change. Shopify never shares your Shopify password with us.</p>
      <a className="btn" href={`/api/shopify/install?shop=${encodeURIComponent(shop)}`}>Connect Shopify</a>
    </FunnelShell>
  );
}
