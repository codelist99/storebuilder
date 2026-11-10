"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

const LOGO = "/landing/store-build-logo.png";
const STORES = "/landing/store-examples.png";
const ADRIAN = "/landing/adrian-morrison.jpg";
const WEBINAR = "https://watch.webby.app/goto/be8ea2f1-30ad-4e16-aea6-84de1cc3cecc";

function useCountdown() {
  const [remaining, setRemaining] = useState(69);
  useEffect(() => {
    const timer = window.setInterval(() => setRemaining((value) => (value <= 0 ? 69 : value - 1)), 1000);
    return () => window.clearInterval(timer);
  }, []);
  return { hours: "00", minutes: String(Math.floor(remaining / 60)).padStart(2, "0"), seconds: String(remaining % 60).padStart(2, "0") };
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
    try {
      await fetch("/api/leads", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(payload) });
    } finally {
      const destination = new URL(WEBINAR);
      for (const [key, value] of Object.entries(attribution)) destination.searchParams.set(key, value);
      window.location.assign(destination.toString());
    }
  }

  return (
    <main className="live-landing">
      <div className="live-alert"><span />THE LIVE STORE BUILDING SESSION IS STARTING SOON! CLICK BELOW TO JOIN NOW!</div>
      <section className="live-hero">
        <div className="live-left">
          <img className="live-logo" src={LOGO} alt="Free E-Com Store Build Express" />
          <h1>Want Us To Give You A Fully<br />Optimized ECommerce<br />Store For <em>FOR FREE?</em></h1>
          <img className="stores-image" src={STORES} alt="Examples of professionally designed ecommerce stores" />
          <h2>Act Now &amp; You’ll Receive:</h2>
          <ul className="benefit-list">
            <li>Amazing Professionally Designed Store</li><li><strong><u>100</u></strong> Hand-Chosen Products Put On Your Store</li><li>Free Shopify Theme Design</li><li>Exclusive Zendrop Integration 100% drop shipped products, no stock or upfront money required</li><li>Privacy Policy, Terms of Service, and Tracking Pages</li><li>Completely Automated Order Fulfillment</li><li><strong>Bonus #1:</strong> Tik Tok Ads Course</li><li><strong>Bonus #2:</strong> Full Access To Adrian&apos;s Ecom Success Academy a $3,000 value.</li>
          </ul>
          <div className="total-value">🛒 Total Value: $4,975</div>
        </div>
        <div className="live-right">
          <div className="free-price">Usually <s>$995</s> <strong>FREE</strong></div>
          <div className="no-payment">NO Payment Required</div>
          <div className="countdown-title"><span /> LIVE STORE BUILDING STARTS IN:</div>
          <div className="countdown"><div><b>{countdown.hours}</b><small>HOURS</small></div><i>:</i><div><b>{countdown.minutes}</b><small>MINUTES</small></div><i>:</i><div><b>{countdown.seconds}</b><small>SECONDS</small></div></div>
          <form className="optin-card" onSubmit={submit}>
            <div className="steps"><div><b>1</b><span><strong>BASIC INFO</strong><small>Name &amp; Email</small></span></div><div className="muted"><b>2</b><span><strong>GET ACCESS</strong><small>To Your NEW Store</small></span></div></div>
            <input name="fullName" autoComplete="name" placeholder="Full Name" required /><input name="email" type="email" autoComplete="email" placeholder="Email Address... Store Build Express Login Will Be Sent Here" required /><input name="phone" type="tel" autoComplete="tel" placeholder="Cell Phone Number (We will text you your login info also)" required />
            <button type="submit" disabled={submitting}>🛒 {submitting ? "JOINING LIVE SESSION..." : "Build Your Free Store Now"}<small>No Payment Info Required!</small></button>
            <p>By providing your information today, you are giving consent for us to contact you by mail, phone, text, or email using automated technology to the data provided. By submitting this form, you agree to our Privacy Policy and Terms &amp; Conditions.</p>
          </form>
          <img className="adrian-image" src={ADRIAN} alt="Adrian Morrison, Shopify Commerce Coach" />
        </div>
      </section>
      <section className="landing-band"><h2>Your Free Store Build Is Only Three Simple Steps Away</h2><div className="three-steps"><div><b>1</b><h3>Reserve Your Spot</h3><p>Enter your information above to join the live store-building session.</p></div><div><b>2</b><h3>Watch The Live Training</h3><p>Follow Adrian and Anthony as they show you how the store-building system works.</p></div><div><b>3</b><h3>Build Your Store</h3><p>Create and securely connect your Shopify store to start the guided build.</p></div></div></section>
    </main>
  );
}
