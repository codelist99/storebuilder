"use client";

import { FormEvent, useState } from "react";

export default function OptinLanding({ attribution }: { attribution: Record<string, string> }) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    const form = new FormData(event.currentTarget);
    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ firstName: form.get("firstName"), lastName: form.get("lastName"), email: form.get("email"), phone: form.get("phone"), attribution }),
      });
      const result = await response.json();
      if (!response.ok || !result.leadId) throw new Error(result.error || "Unable to continue");
      const query = new URLSearchParams(attribution);
      query.set("lead", result.leadId);
      window.location.assign(`/store-color?${query.toString()}`);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Please try again.");
      setSubmitting(false);
    }
  }

  return (
    <main className="esa-optin">
      <div className="esa-live-strip"><span />THE LIVE STORE BUILDING SESSION IS STARTING NOW! CLICK BELOW TO JOIN NOW!</div>
      <section className="esa-hero">
        <h1><strong>Congrats!</strong> Follow The Steps Below To Get YOUR<br /> E-Com Store <u>BUILT FOR YOU</u> <em>100% FREE!</em></h1>
        <div className="esa-card">
          <h2><strong>STEP 1:</strong> Create Your <em>Free Account</em> &amp; We Will <u>Build Your Store Now!</u></h2>
          <div className="esa-grid">
            <div className="esa-presentation">
              <div className="esa-video">
                <video autoPlay muted playsInline controls poster="https://i.vimeocdn.com/video/1633855286-9856d507137dbd3f26baee34c9fbc3ee39fbeb8e54db003770d6997df1606754-d">
                  <source src="/media/dfy-store-landing-web.mp4" type="video/mp4" />
                </video>
              </div>
              <div className="esa-important"><b>** IMPORTANT **</b><br />This is your ONLY chance to get a Done For You Store Built<br /><strong>100% FREE!</strong> If you close this page, you may never <i>see this<br /> free offer again.</i></div>
              <p className="esa-bonus">As a <b>special bonus</b> I am pre-loading your store<br />with <u>100+ home-run potential products</u>!</p>
            </div>
            <aside className="esa-form-card">
              <h3>Create Your <em>Free Account</em> Below:</h3>
              <p>Our software will build you a professional<br />Shopify store in less than 15 minutes....</p>
              <form onSubmit={submit}>
                <input name="firstName" autoComplete="given-name" placeholder="First Name Here..." required />
                <input name="lastName" autoComplete="family-name" placeholder="Last Name Here..." required />
                <input name="email" type="email" autoComplete="email" placeholder="Email Address... Store Build Express Login Will Be Sent Here" required />
                <input name="phone" type="tel" autoComplete="tel" placeholder="Cell Phone Number... (We will text you your login info)" required />
                {error && <p className="esa-error">{error}</p>}
                <button type="submit" disabled={submitting}><span className="esa-cart">🛒</span><span>{submitting ? "Creating Your Account..." : "Build Your FREE Store"}<small>We do not ask for any payment info at any time!</small></span></button>
              </form>
              <p className="esa-legal">By providing your information today, you are giving consent for us to contact you by mail, phone, text, or email using automated technology to the data provided, even if the phone number is present on a state or national Do Not Call list. You can do so in confidence as we do not sell any personal information to other companies, and you can withdraw consent at any time. By submitting this form, you agree to our Privacy Policy and Terms &amp; Conditions.</p>
              <div className="esa-countdown"><h4><span /> LIVE STORE BUILDING STARTS IN:</h4><div className="esa-clock"><b>00</b><i>:</i><b>00</b><i>:</i><b>00</b></div><div className="esa-clock-labels"><span>HOURS</span><span>MINUTES</span><span>SECONDS</span></div></div>
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}
