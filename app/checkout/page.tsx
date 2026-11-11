import { NmiCheckout } from "@/components/NmiCheckout";

const offers = {
  dfy_997: { name: "Premium DFY Store", amount: "997.00" },
  premium_97: { name: "Premium Store Upgrade", amount: "97.00" },
  premium_47: { name: "Premium Store Upgrade — Special Offer", amount: "47.00" },
} as const;

export default async function CheckoutPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await searchParams;
  const offerKey = typeof params.offer === "string" ? params.offer : "";
  const offer = offers[offerKey as keyof typeof offers];
  const publicKey = process.env.NMI_PUBLIC_KEY || "";
  if (!offer) return <main className="checkout-page"><section className="checkout-card"><h1>Checkout unavailable</h1><p>This offer link is invalid.</p></section></main>;
  if (!publicKey) return <main className="checkout-page"><section className="checkout-card"><h1>Secure checkout is being configured</h1><p>Please contact support@kairostechnologylabs.com.</p></section></main>;
  return <main className="checkout-page"><section className="checkout-card">
    <img src="/landing/store-build-logo.png" alt="BuildMyStore" />
    <h1>Complete your order</h1>
    <div className="checkout-summary"><strong>{offer.name}</strong><b>${offer.amount}</b></div>
    <NmiCheckout publicKey={publicKey} offer={offerKey} amount={offer.amount} shop={typeof params.shop === "string" ? params.shop : ""} leadId={typeof params.lead === "string" ? params.lead : ""} />
  </section></main>;
}
