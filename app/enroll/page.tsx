const inclusions = [
  ["Shopify General Store With Premium Theme + Products Loaded", "$299 Value"],
  ["2 DFY Niche Store Builds + Products Loaded", "$597 Value"],
  ["ShineOn Exclusive Vendor + 100 DFY Products + ShineOn Premium Theme", "$997 Value"],
  ["Optimized Upsell Software", "$1,497 Value"],
  ["Product Pipeline Reports", "$1,997 Value"],
  ["Product Pusher Software", "$397 Value"],
  ["Ecom Storefront Optimization Products Training", "$997 Value"],
  ["Tik Tok Domination Course", "$997 Value"],
  ["DFY Store Setup & Launch With Us", "$1,997 Value"],
];

export default async function EnrollPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await searchParams;
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (typeof value === "string") query.set(key, value);
  }
  query.set("offer", "dfy_997");
  const checkoutUrl = `/checkout?${query.toString()}`;

  return <main className="enroll-page">
    <section className="enroll-card">
      <div className="enroll-form-panel">
        <img src="/landing/store-build-logo.png" alt="BuildMyStore" />
        <h1>Complete Your Premium DFY Store Enrollment</h1>
        <div className="enroll-summary"><strong>Premium DFY Store</strong><span>$997.00</span></div>
        <p>Your secure payment is processed by our checkout provider. Your order includes the complete Premium DFY Store package shown here.</p>
        <a className="enroll-checkout" href={checkoutUrl}>Continue to secure checkout</a>
        <ul className="enroll-trust"><li>Your order is processed securely.</li><li>Your information is handled according to our Privacy Policy.</li><li>Questions? Email support@kairostechnologylabs.com.</li></ul>
      </div>
      <div className="enroll-offer-panel">
        <h2>Here&apos;s Everything You&apos;re Getting Today</h2>
        <ul>{inclusions.map(([item, value]) => <li key={item}><span>▣ {item}</span><b>({value})</b></li>)}</ul>
        <div className="enroll-total">🛒 Total Value: $6,781</div>
        <div className="enroll-price">Today Only: $997</div>
        <img src="/landing/adrian-morrison.jpg" alt="Adrian Morrison" />
        <h3>Adrian Morrison · Shopify Commerce Coach</h3>
        <p>Adrian is a Shopify Commerce Coach who has helped thousands of people with their Shopify stores.</p>
      </div>
    </section>
    <footer><strong>BuildMyStore</strong><span>Copyright Publishing, LLC © All Rights Reserved</span><span>Privacy Policy · Terms of Service · Contact Us</span></footer>
  </main>;
}
