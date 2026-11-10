import Link from "next/link";
import { FunnelShell } from "@/components/FunnelShell";

export default async function BuildCompletePage({ searchParams }: { searchParams: Promise<{ shop?: string }> }) {
  const { shop = "" } = await searchParams;
  return (
    <FunnelShell>
      <div className="success"><h1>Your store foundation has been set up!</h1><div className="check">✓</div></div>
      <Link className="btn" href={`/publish?shop=${encodeURIComponent(shop)}`}>Next — publish store</Link>
    </FunnelShell>
  );
}
