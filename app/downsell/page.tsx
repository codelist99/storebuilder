import Link from "next/link";
import { FunnelShell } from "@/components/FunnelShell";
import { OfferVideo } from "@/components/OfferVideo";

export default function DownsellPage() {
  return (
    <FunnelShell>
      <h1>Wait — get the Premium Store for less</h1>
      <OfferVideo src={process.env.DOWNSELL_VIDEO_URL} label="Premium Store downsell" />
      <p>Build the upgraded store without paying the full $97 today.</p>
      <div className="offer-price">$47</div>
      <a className="btn" href={process.env.PREMIUM_DOWNSELL_CHECKOUT_URL || "/downsell?checkout=pending"}>Yes — claim the discounted upgrade</a>
      <Link className="btn secondary" href="/build">No thanks — build my free store</Link>
    </FunnelShell>
  );
}
