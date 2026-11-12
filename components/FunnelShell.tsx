export function FunnelShell({ children, step = "Step 1 · Create your Shopify store" }: { children: React.ReactNode; step?: string }) {
  return <main className="shell"><div className="brand">Build<span>MyStore</span></div><section className="step-card"><div className="step-kicker">👉 {step}</div>{children}</section></main>;
}
