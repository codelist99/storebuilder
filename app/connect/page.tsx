import { ConnectShopifyStore } from "@/components/ConnectShopifyStore";
import { FunnelShell } from "@/components/FunnelShell";

export default async function ConnectPage({ searchParams }: { searchParams: Promise<{ lead?: string; shop?: string }> }) {
  const { lead = "", shop = "" } = await searchParams;
  return <FunnelShell step="STEP 1 · Create Your Shopify Store"><ConnectShopifyStore lead={lead} initialShop={shop} /></FunnelShell>;
}
