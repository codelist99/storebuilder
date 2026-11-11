"use client";

import Script from "next/script";
import { FormEvent, useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    CollectJS?: {
      configure: (options: Record<string, unknown>) => void;
      startPaymentRequest: (event?: Event) => void;
    };
  }
}

type Props = {
  publicKey: string;
  offer: string;
  amount: string;
  shop?: string;
  leadId?: string;
  showProductBump?: boolean;
};

export function NmiCheckout({ publicKey, offer, amount, shop = "", leadId = "", showProductBump = false }: Props) {
  const formRef = useRef<HTMLFormElement>(null);
  const [ready, setReady] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [productBump, setProductBump] = useState(false);
  const total = (Number(amount) + (productBump ? 17 : 0)).toFixed(2);

  function configure() {
    if (!window.CollectJS) return;
    window.CollectJS.configure({
      variant: "inline",
      price: total,
      currency: "USD",
      country: "US",
      fields: {
        ccnumber: { selector: "#ccnumber", title: "Card number", placeholder: "Card number" },
        ccexp: { selector: "#ccexp", title: "Expiration", placeholder: "MM / YY" },
        cvv: { selector: "#cvv", title: "CVV", placeholder: "CVV" },
      },
      styleSniffer: true,
      fieldsAvailableCallback: () => setReady(true),
      timeoutCallback: () => {
        setSubmitting(false);
        setError("The secure card fields timed out. Please refresh and try again.");
      },
      callback: async (response: { token?: string }) => {
        const form = formRef.current;
        if (!form || !response.token) {
          setSubmitting(false);
          setError("We could not secure the card details. Please try again.");
          return;
        }
        const values = Object.fromEntries(new FormData(form));
        try {
          const request = await fetch("/api/payments/nmi", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ ...values, paymentToken: response.token, offer, shop, leadId, productBump }),
          });
          const result = await request.json();
          if (!request.ok || !result.ok) throw new Error(result.error || "Payment was not approved.");
          window.location.assign(result.redirect);
        } catch (cause) {
          setSubmitting(false);
          setError(cause instanceof Error ? cause.message : "Payment was not approved.");
        }
      },
    });
  }

  useEffect(() => { configure(); }, [total]);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!ready || submitting || !window.CollectJS) return;
    setError("");
    setSubmitting(true);
    window.CollectJS.startPaymentRequest(event.nativeEvent);
  }

  return <>
    <Script
      src="https://secure.nmi.com/token/Collect.js"
      data-tokenization-key={publicKey}
      strategy="afterInteractive"
      onLoad={configure}
    />
    <form ref={formRef} className="nmi-form" onSubmit={submit}>
      <div className="nmi-row"><label>First name<input name="firstName" autoComplete="given-name" required /></label><label>Last name<input name="lastName" autoComplete="family-name" required /></label></div>
      <label>Email<input name="email" type="email" autoComplete="email" required /></label>
      <label>Phone<input name="phone" type="tel" autoComplete="tel" required /></label>
      <label>Billing address<input name="address" autoComplete="address-line1" required /></label>
      <div className="nmi-row"><label>City<input name="city" autoComplete="address-level2" required /></label><label>State<input name="state" autoComplete="address-level1" required /></label></div>
      <div className="nmi-row"><label>ZIP code<input name="zip" autoComplete="postal-code" required /></label><label>Country<select name="country" defaultValue="US"><option value="US">United States</option><option value="CA">Canada</option></select></label></div>
      <div className="nmi-card-fields"><label>Card number<div id="ccnumber" /></label><div className="nmi-row"><label>Expiration<div id="ccexp" /></label><label>Security code<div id="cvv" /></label></div></div>
      {showProductBump && <label className="checkout-bump"><input type="checkbox" checked={productBump} onChange={(event) => setProductBump(event.target.checked)} /><span><strong>Yes, add Product Sniper Software for $17</strong><small>Include the optional product-research tool with this order.</small></span></label>}
      {error && <p className="nmi-error" role="alert">{error}</p>}
      <button className="enroll-checkout" type="submit" disabled={!ready || submitting}>{submitting ? "Processing securely…" : `Pay $${total} securely`}</button>
      <p className="nmi-secure">🔒 Secure encrypted checkout · Your card details never touch our servers.</p>
    </form>
  </>;
}
