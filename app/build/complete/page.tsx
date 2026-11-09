import Link from "next/link";
import { FunnelShell } from "@/components/FunnelShell";

export default function BuildCompletePage() {
  return (
    <FunnelShell>
      <div className="success"><h1>Your store has been set up!</h1><div className="check">✓</div></div>
      <Link className="btn" href="/publish">Next — publish store</Link>
    </FunnelShell>
  );
}
