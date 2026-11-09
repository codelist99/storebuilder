import Link from "next/link";
import { FunnelShell } from "@/components/FunnelShell";

export default function BuildPage() {
  return (
    <FunnelShell>
      <h1>🤖 Customize your store</h1>
      <p>Our builder will install your theme foundation, essential pages and navigation. Product loading is handled in the next stage.</p>
      <Link className="btn" href="/build/complete">Set up your store</Link>
    </FunnelShell>
  );
}
