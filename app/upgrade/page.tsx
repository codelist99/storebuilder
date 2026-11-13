import Link from "next/link";
import { FunnelShell } from "@/components/FunnelShell";
import { OfferVideo } from "@/components/OfferVideo";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ shop?: string; lead?: string }>;
}) {
  const { shop = "", lead = "" } = await searchParams;
  const q = new URLSearchParams({ offer: "premium_97", shop, lead });

  return (
    <FunnelShell>
      <h1 className="compact-title">
        💰 For You that want to get even Faster Results
      </h1>
      <OfferVideo
        src={process.env.PREMIUM_VIDEO_URL || "/videos/premium-upgrade.mp4"}
        label="Premium Store"
      />
      <p>
        <strong>Upgrade for 2026:</strong> Add 200 products, including
        researched best sellers, with a conversion-focused premium design.
      </p>
      <p>
        Your Premium Store includes the pro theme, two professional banners,
        optimized product pages, an expanded product catalog, and access to the
        weekly live workshop.
      </p>
      <div className="comparison">
        <div className="premium">
          <h2>Premium Store</h2>
          <ul>
            <li>Pro theme + optimized conversions</li>
            <li>2 professional banners</li>
            <li>250+ premium products</li>
            <li>Customized product pages</li>
            <li>Weekly live workshop</li>
          </ul>
          <div className="offer-price">$97</div>
        </div>
        <div>
          <h2>Beginner Store</h2>
          <ul>
            <li>Free Shopify theme</li>
            <li>2 banners</li>
            <li>Starter setup</li>
          </ul>
          <div className="offer-price muted-price">$0</div>
        </div>
      </div>
      <Link className="btn" href={`/checkout?${q}`}>
        Get Access To Your Premium Store Now
      </Link>
      <Link
        className="btn secondary"
        href={`/downsell?shop=${encodeURIComponent(shop)}&lead=${encodeURIComponent(lead)}`}
      >
        I want to continue with the Beginner Store
      </Link>
    </FunnelShell>
  );
}
