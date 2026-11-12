import Link from "next/link";
import { FunnelShell } from "@/components/FunnelShell";

export default async function Page({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await searchParams;
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (typeof value === "string") query.set(key, value);
  }

  return <FunnelShell>
    <h1 className="compact-title">✅ Open Your Shopify Account + FREE Bonuses</h1>
    <div className="video">
      <video controls playsInline preload="metadata" src="/videos/open-shopify.mp4" />
    </div>
    <h3>IMPORTANT: Please Read</h3>
    <p>To successfully build your store you need the specific Shopify free-trial account. Open it using the green button, finish creating your store, then return here.</p>
    <a className="btn" href="/go/shopify" target="_blank" rel="noopener noreferrer">Get Your Shopify Account + Bonuses Now</a>
    <Link className="btn secondary outline-green" href={"/connect?" + query.toString()}>☑ Done</Link>
  </FunnelShell>;
}
