import Link from "next/link";
import { FunnelShell } from "@/components/FunnelShell";
import { OfferVideo } from "@/components/OfferVideo";

export default async function DownsellPage({ searchParams }: { searchParams: Promise<{ shop?: string }> }) {
  const { shop = "" } = await searchParams;
  const checkoutUrl = `/checkout?offer=premium_47&shop=${encodeURIComponent(shop)}`;
  return (
    <FunnelShell>
      <h1>Wait — get the Premium Store for less</h1>
      <OfferVideo src={process.env.DOWNSELL_VIDEO_URL} label="Premium Store downsell" />
      <p>Build the upgraded store without paying the full $97 today.</p>
      <div className="offer-price">$47</div>
      <a className="btn" href={checkoutUrl}>Yes — claim the discounted upgrade</a>
      <Link className="btn secondary" href={`/build?shop=${encodeURIComponent(shop)}`}>No thanks — build my free store</Link>
    </FunnelShell>
  );
}
