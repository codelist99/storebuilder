import Link from "next/link";
import { FunnelShell } from "@/components/FunnelShell";

export default function Home() {
  return (
    <FunnelShell step="Free ecommerce store build">
      <h1>We’ll build your Shopify store for you</h1>
      <p>Open your Shopify account, securely connect your store, and let our builder install the storefront foundation for you.</p>
      <ul>
        <li>Professionally structured Shopify storefront</li>
        <li>Theme, pages and navigation configured</li>
        <li>Product import workflow included</li>
      </ul>
      <Link className="btn" href="/start">Start my free store build</Link>
    </FunnelShell>
  );
}
