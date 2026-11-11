import { FunnelShell } from "@/components/FunnelShell";

export default async function InstallPage({ searchParams }: { searchParams: Promise<{ shop?: string; lead?: string }> }) {
  const { shop = "", lead = "" } = await searchParams;
  const installQuery = new URLSearchParams({ shop });
  if (/^[0-9a-f-]{36}$/i.test(lead)) installQuery.set("lead", lead);
  return (
    <FunnelShell>
      <h1>Connect BuildMyStore</h1>
      <h2>It’s time to install the BuildMyStore app</h2>
      <p>The Shopify authorization screen will show exactly what the builder can change. Shopify never shares your Shopify password with us.</p>
      <a className="btn" href={`/api/shopify/install?${installQuery.toString()}`}>Connect Shopify</a>
    </FunnelShell>
  );
}
