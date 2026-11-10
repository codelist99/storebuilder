"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

const faqItems = [
  ["Are your stores really free?", "Yes. We build the initial Shopify store without charging a store-building fee. You still need an active Shopify account and are responsible for Shopify and any optional services you choose."],
  ["Do I own the store?", "Yes. The Shopify account and store belong to you, and you control the products, branding and settings."],
  ["How many products will I get on my store?", "Your free store includes a starter selection of hand-chosen products. Additional product and premium design options may be offered during the guided build."],
  ["What other fees are associated with this?", "Shopify charges for its ecommerce platform after any promotional trial. Optional apps, domains, advertising and upgrades may have separate costs."],
  ["Do you guarantee I'll make a profit? How fast will I make money?", "No business can guarantee profits or a specific timeline. Results depend on your products, pricing, marketing, effort and many other factors."],
  ["What if I have my own products? Can I add them to my store?", "Absolutely. It is your store, so you can add, edit or remove products whenever you want."],
  ["Will you help me make changes to my Shopify Store?", "The guided training shows you how the build works and how to manage your store. Shopify also provides tools and support for ongoing changes."],
  ["Do you advertise the store for me?", "Advertising is not included with the free build. You are responsible for choosing and funding any marketing you want to run."],
  ["What if I already have a Shopify Store?", "You can still attend the training and use the process, but use a separate development or new store if you do not want an existing store changed."],
];

function useCountdown() {
  const [remaining, setRemaining] = useState(69);
  useEffect(() => {
    const timer = window.setInterval(() => setRemaining((value) => (value <= 0 ? 69 : value - 1)), 1000);
    return () => window.clearInterval(timer);
  }, []);
  return { hours: "00", minutes: String(Math.floor(remaining / 60)).padStart(2, "0"), seconds: String(remaining % 60).padStart(2, "0") };
}

function LandingCta() {
  return <a className="landing-cta" href="#optin">Build Your FREE Shopify Store Now<small>Limited Time Available</small></a>;
}

export function LiveStoreLanding() {
  const query = useSearchParams();
  const countdown = useCountdown();
  const [submitting, setSubmitting] = useState(false);
  const attribution = useMemo(() => Object.fromEntries(query.entries()), [query]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    const values = new FormData(event.currentTarget);
    const payload = { fullName: String(values.get("fullName") || "").trim(), email: String(values.get("email") || "").trim(), phone: String(values.get("phone") || "").trim(), attribution };
    try { await fetch("/api/leads", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(payload) }); }
    finally {
      const destination = new URL("/webinar", window.location.origin);
      for (const [key, value] of Object.entries(attribution)) destination.searchParams.set(key, value);
      window.location.assign(destination.toString());
    }
  }

  return <main className="live-landing">
    <div className="live-alert"><span />THE LIVE STORE BUILDING SESSION IS STARTING SOON! CLICK BELOW TO JOIN NOW!</div>
    <section className="live-hero">
      <div className="live-left">
        <img className="live-logo" src="/landing/store-build-logo.png" alt="Free E-Com Store Build Express" />
        <h1>Want Us To Give You A Fully<br />Optimized ECommerce<br />Store For <em>FOR FREE?</em></h1>
        <img className="stores-image" src="/landing/store-examples.png" alt="Examples of professionally designed ecommerce stores" />
        <h2>Act Now &amp; You&apos;ll Receive:</h2>
        <ul className="benefit-list"><li>Amazing Professionally Designed Store</li><li><strong><u>100</u></strong> Hand-Chosen Products Put On Your Store</li><li>Free Shopify Theme Design</li><li>Exclusive Zendrop Integration 100% drop shipped products, no stock or upfront money required</li><li>Privacy Policy, Terms of Service, and Tracking Pages</li><li>Completely Automated Order Fulfillment</li><li><strong>Bonus #1:</strong> Tik Tok Ads Course</li><li><strong>Bonus #2:</strong> Full Access To Adrian&apos;s Ecom Success Academy a $3,000 value.</li></ul>
        <div className="total-value">🛒 Total Value: $4,975</div>
      </div>
      <div className="live-right">
        <div className="free-price">Usually <s>$995</s> <strong>FREE</strong></div><div className="no-payment">NO Payment Required</div>
        <div className="countdown-title"><span /> LIVE STORE BUILDING STARTS IN:</div>
        <div className="countdown"><div><b>{countdown.hours}</b><small>HOURS</small></div><i>:</i><div><b>{countdown.minutes}</b><small>MINUTES</small></div><i>:</i><div><b>{countdown.seconds}</b><small>SECONDS</small></div></div>
        <form id="optin" className="optin-card" onSubmit={submit}>
          <div className="steps"><div><b>1</b><span><strong>BASIC INFO</strong><small>Name &amp; Email</small></span></div><div className="muted"><b>2</b><span><strong>GET ACCESS</strong><small>To Your NEW Store</small></span></div></div>
          <input name="fullName" autoComplete="name" placeholder="Full Name" required /><input name="email" type="email" autoComplete="email" placeholder="Email Address... Store Build Express Login Will Be Sent Here" required /><input name="phone" type="tel" autoComplete="tel" placeholder="Cell Phone Number (We will text you your login info also)" required />
          <button type="submit" disabled={submitting}>🛒 {submitting ? "JOINING LIVE SESSION..." : "Build Your Free Store Now"}<small>No Payment Info Required!</small></button>
          <p>By providing your information today, you are giving consent for us to contact you by mail, phone, text, or email using automated technology to the data provided. By submitting this form, you agree to our Privacy Policy and Terms &amp; Conditions.</p>
        </form>
        <img className="adrian-image" src="/landing/adrian-morrison.jpg" alt="Adrian Morrison, Shopify Commerce Coach" />
      </div>
    </section>

    <section className="how-it-works landing-section"><h2><span>A Few Simple Steps</span>How it Works</h2><div className="process-grid">
      <article><img src="/landing/step-build.png" alt="Store builder" /><h3>Our AI Store Builder<br />Builds Your Store</h3><p>Our technology creates the foundation of your Shopify store and helps configure the important pieces.</p></article>
      <article><img src="/landing/step-sales.png" alt="Collect sales" /><h3>Collect Your Sales<br />From Customers</h3><p>Publish your store, market your products and collect customer orders through Shopify.</p></article>
      <article><img src="/landing/step-scale.png" alt="Scale your store" /><h3>Redo This Cycle<br />To Scale More</h3><p>Test new products and campaigns, learn what converts, and continue growing your ecommerce business.</p></article>
    </div><LandingCta /></section>

    <section className="store-showcase landing-section alternate"><h2>Examples Of Our Ecommerce Stores:</h2><div className="store-grid"><img src="/landing/store-hortense.png" alt="Jewelry ecommerce store example" /><img src="/landing/store-select.png" alt="Fashion ecommerce store example" /><img src="/landing/store-goodfair.png" alt="Apparel ecommerce store example" /><img src="/landing/store-sustainable.png" alt="Sustainable products ecommerce store example" /></div><LandingCta /></section>

    <section className="faq-section landing-section"><h2>Frequently Asked</h2><div className="faq-list">{faqItems.map(([question, answer]) => <details key={question} open><summary>{question}</summary><p>{answer}</p></details>)}</div><LandingCta /></section>

    <section className="testimonial-section landing-section alternate"><h2>Trusted By Ecommerce Store Owners</h2><div className="testimonial-card"><img src="/landing/zendrop-review.png" alt="Five-star ecommerce customer review" /><div><span>★★★★★</span><h3>Fast product fulfillment and a simpler store workflow</h3><p>Our guided store build is designed to give new owners a practical starting point without the usual design and setup headaches.</p></div></div></section>

    <section className="catch-section landing-section"><h2>But…What&apos;s The Catch?!</h2><h3>The Short Answer? There Isn&apos;t One!</h3><div className="catch-card"><img src="/landing/adrian-proof.png" alt="Adrian Morrison ecommerce experience" /><div><p>Our goal is to help more entrepreneurs start a Shopify store with the right foundation, products and training.</p><p>The free build lets you see the system in action. Shopify compensates eligible partners when new merchants create qualifying accounts, and optional upgrades may be offered—but you are never required to purchase an upgrade to receive the free starter build.</p></div></div><LandingCta /></section>

    <section className="high-converting landing-section alternate"><h2>What If You Could Have A High-Converting Shopify Store Made for You?</h2><div className="without-instead"><article className="without"><h3>Without…</h3><ul><li>Spending weeks trying to design everything yourself</li><li>Paying thousands to a designer or programmer</li><li>Guessing which products and suppliers to use</li><li>Getting stuck on technical store setup</li><li>Starting from a blank page</li></ul></article><article className="instead"><h3>And Instead…</h3><ul><li>Start with a professionally organized Shopify store</li><li>Receive a hand-selected starter product catalog</li><li>Follow a guided, repeatable build process</li><li>Own and control your store and products</li><li>Get moving without a store-building fee</li></ul></article></div><LandingCta /></section>

    <section className="options-section landing-section"><h2>You Really Have Two Options…</h2><div className="option-grid"><article><img src="/landing/option-1.png" alt="Option one" /><h3>Create Your Shopify Store Yourself</h3><p>Spend the time researching themes, products, suppliers and apps, then handle the design and technical setup on your own—or pay outside specialists to do it.</p></article><article><img src="/landing/option-2.png" alt="Option two" /><h3>Start With Your Store Already Built</h3><p>Invest $0 into the starter build and begin with a quality store foundation, starter products and a guided process you can follow.</p></article></div><h3 className="no-brainer">I don&apos;t know about you, but that seems like a no-brainer to me!</h3><LandingCta /></section>

    <footer className="landing-footer">Copyright Publishing, LLC © All Rights Reserved <a href="#">Privacy Policy</a> | <a href="#">Terms of Service</a> | <a href="mailto:support@kairostechnologylabs.com">Contact Us</a></footer>
  </main>;
}
