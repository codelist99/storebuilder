import { FunnelShell } from "@/components/FunnelShell";

export default function ReadyPage() {
  return (
    <FunnelShell>
      <h1>🏆 Your Shopify Store Is Ready!</h1>
      <p>Your storefront foundation is live. Products have not been uploaded yet; that happens in Step 2.</p>
      <a className="btn" href="https://admin.shopify.com" target="_blank" rel="noopener noreferrer">View my store online</a>
      <h2>📦 Step 2: Add Winning Products</h2>
      <p className="notice">Product sourcing, supplier integration and import automation are the next implementation phase.</p>
    </FunnelShell>
  );
}
