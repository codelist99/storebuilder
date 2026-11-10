import { FunnelShell } from "@/components/FunnelShell";

export default async function BuildPage({ searchParams }: { searchParams: Promise<{ shop?: string; error?: string }> }) {
  const { shop = "", error } = await searchParams;
  return (
    <FunnelShell>
      <h1>🤖 Customize your store</h1>
      <p>Our builder will securely create your essential store pages and prepare the foundation for theme and product setup.</p>
      {error && <p className="notice">The build could not finish. Please verify the app is still installed, then try again.</p>}
      <form action="/api/build/start" method="post">
        <input type="hidden" name="shop" value={shop} />
        <button className="btn" type="submit" disabled={!shop}>Set up your store</button>
      </form>
    </FunnelShell>
  );
}
