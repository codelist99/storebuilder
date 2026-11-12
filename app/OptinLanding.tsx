"use client";

import { FormEvent, useState } from "react";

export default function OptinLanding({ attribution }: { attribution: Record<string, string> }) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setSubmitting(true); setError("");
    const form = new FormData(event.currentTarget);
    try {
      const response = await fetch("/api/leads", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ firstName: form.get("firstName"), lastName: form.get("lastName"), email: form.get("email"), phone: form.get("phone"), attribution }) });
      const result = await response.json();
      if (!response.ok || !result.leadId) throw new Error(result.error || "Unable to continue");
      const query = new URLSearchParams(attribution); query.set("lead", result.leadId);
      window.location.assign(`/store-color?${query.toString()}`);
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Please try again."); setSubmitting(false); }
  }

  return <main className="esa-optin">
    <header className="esa-header"><div className="esa-brand">Build<span>MyStore</span></div><div className="esa-secure">100% FREE STORE BUILD</div></header>
    <section className="esa-hero">
      <h1>Congrats! Follow The Steps Below To Get <em>Your E-Com Store</em> Built For You 100% Free!</h1>
      <div className="esa-grid">
        <div className="esa-presentation">
          <div className="esa-video"><iframe src="https://player.vimeo.com/video/808839409?autoplay=1&muted=1&title=0&byline=0&portrait=0" title="How your free store build works" allow="autoplay; fullscreen; picture-in-picture" allowFullScreen /></div>
          <h2>Your New Online Store Is Just Minutes Away</h2>
          <ul><li>A professionally designed Shopify store</li><li>Winning products ready for customization</li><li>A guided, step-by-step store builder</li><li>No payment information required to begin</li></ul>
        </div>
        <aside className="esa-form-card">
          <div className="esa-step">STEP 1</div>
          <h2>Create Your Free Account &amp; We Will Build Your Store Now!</h2>
          <p className="esa-urgency">This is your opportunity to get a done-for-you e-commerce store with a ready-to-customize product catalog.</p>
          <form onSubmit={submit}>
            <div className="esa-name-row"><label>First Name<input name="firstName" autoComplete="given-name" required /></label><label>Last Name<input name="lastName" autoComplete="family-name" required /></label></div>
            <label>Email Address<input name="email" type="email" autoComplete="email" required /></label>
            <label>Phone Number<input name="phone" type="tel" autoComplete="tel" required /></label>
            {error && <p className="esa-error">{error}</p>}
            <button type="submit" disabled={submitting}>{submitting ? "Creating Your Account…" : "Build Your FREE Store"}</button>
          </form>
          <div className="esa-no-card">🔒 We do not ask for payment information at any time.</div>
        </aside>
      </div>
    </section>
    <section className="esa-lower"><h2>Everything You Need To Launch Your E-Commerce Store</h2><div className="esa-features"><article><b>1</b><h3>Create Your Account</h3><p>Tell us where to send your access and enter the guided builder.</p></article><article><b>2</b><h3>Customize Your Store</h3><p>Choose your colors, banners and store design in a few simple steps.</p></article><article><b>3</b><h3>Connect Shopify</h3><p>Securely install BuildMyStore and finish your store setup.</p></article></div></section>
  </main>;
}
