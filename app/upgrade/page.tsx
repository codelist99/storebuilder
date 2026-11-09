import Link from "next/link";
import { FunnelShell } from "@/components/FunnelShell";
import { OfferVideo } from "@/components/OfferVideo";

export default function UpgradePage() {
  return (
    <FunnelShell>
      <h1>💰 Get faster results with a Premium Store</h1>
      <OfferVideo src={process.env.PREMIUM_VIDEO_URL} label="Premium Store" />
      <p>Upgrade your store with a conversion-focused theme, professional banners, optimized product pages and an expanded winning-product catalog.</p>
      <div className="comparison">
        <div className="premium"><h2>Premium Store</h2><ul><li>Premium theme</li><li>Professional banners</li><li>Expanded product catalog</li><li>Optimized product pages</li></ul></div>
        <div><h2>Beginner Store</h2><ul><li>Free Shopify theme</li><li>Basic banners</li><li>Starter product selection</li></ul></div>
      </div>
      <div className="offer-price">$97</div>
      <a className="btn" href={process.env.PREMIUM_CHECKOUT_URL || "/upgrade?checkout=pending"}>Yes — upgrade my store</a>
      <Link className="btn secondary" href="/downsell">No thanks — continue with the basic store</Link>
    </FunnelShell>
  );
}
