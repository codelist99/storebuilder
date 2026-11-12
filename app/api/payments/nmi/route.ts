import crypto from "node:crypto";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { chargeNmiToken } from "@/lib/nmi";
import { normalizeShop } from "@/lib/shopify";

const offers = {
  premium_97: { name: "Premium Store Upgrade", amount: "97.00", cents: 9700, plan: "premium_97", redirect: "/build" },
  premium_47: { name: "Premium Store Upgrade — Special Offer", amount: "47.00", cents: 4700, plan: "premium_47", redirect: "/build" },
} as const;

function value(body: Record<string, unknown>, key: string) { return String(body[key] || "").trim(); }

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({})) as Record<string, unknown>;
  const offerKey = value(body, "offer") as keyof typeof offers;
  const offer = offers[offerKey];
  const paymentToken = value(body, "paymentToken");
  const email = value(body, "email").toLowerCase();
  if (!offer || !paymentToken || !email) return NextResponse.json({ error: "Required checkout information is missing." }, { status: 400 });
  for (const field of ["firstName", "lastName", "phone", "address", "city", "state", "zip"]) {
    if (!value(body, field)) return NextResponse.json({ error: "Please complete every billing field." }, { status: 400 });
  }

  const shop = normalizeShop(value(body, "shop"));
  const leadId = value(body, "leadId");
  const productBump = offerKey === "premium_47" && body.productBump === true;
  const amount = productBump ? "64.00" : offer.amount;
  const cents = productBump ? 6400 : offer.cents;
  const productCode = productBump ? `${offerKey}+product_sniper_17` : offerKey;
  const orderId = `BMS-${Date.now()}-${crypto.randomBytes(3).toString("hex")}`;
  let result;
  try {
    result = await chargeNmiToken({
      paymentToken,
      amount,
      orderId,
      description: productBump ? `${offer.name} + Product Sniper Software` : offer.name,
      customer: {
        firstName: value(body, "firstName"), lastName: value(body, "lastName"), email,
        phone: value(body, "phone"), address: value(body, "address"), city: value(body, "city"),
        state: value(body, "state"), zip: value(body, "zip"), country: value(body, "country") || "US",
      },
    });
  } catch (cause) {
    console.error("NMI request failed", cause instanceof Error ? cause.message : cause);
    return NextResponse.json({ error: "Secure checkout is temporarily unavailable. Please try again shortly." }, { status: 503 });
  }

  const sql = db();
  if (!result.ok) {
    try { await sql`insert into funnel_events (event_name, properties) values ('payment_declined', ${JSON.stringify({ offer: offerKey, email, responseCode: result.responseCode })}::jsonb)`; }
    catch (cause) { console.error("Could not record NMI decline", cause instanceof Error ? cause.message : cause); }
    return NextResponse.json({ error: result.message }, { status: 402 });
  }

  let resolvedLeadId = null;
  try {
    const leadRows = leadId
      ? await sql`select id from leads where id::text = ${leadId} limit 1`
      : await sql`select id from leads where lower(email) = ${email} order by created_at desc limit 1`;
    const shopRows = shop ? await sql`select id from shops where shop_domain = ${shop} limit 1` : [];
    resolvedLeadId = leadRows[0]?.id || null;
    const resolvedShopId = shopRows[0]?.id || null;
    await sql`insert into orders (lead_id, shop_id, processor, processor_transaction_id, product_code, amount_cents, status)
      values (${resolvedLeadId}, ${resolvedShopId}, 'nmi', ${result.transactionId}, ${productCode}, ${cents}, 'paid')`;
    await sql`insert into funnel_events (lead_id, shop_id, event_name, properties)
      values (${resolvedLeadId}, ${resolvedShopId}, 'payment_approved', ${JSON.stringify({ offer: offerKey, amount, productBump, transactionId: result.transactionId })}::jsonb)`;
    if (shop && offer.plan) await sql`update shops set selected_plan = ${offer.plan}, updated_at = now() where shop_domain = ${shop}`;
  } catch (cause) {
    // The gateway already approved the charge. Never invite a duplicate retry
    // just because internal reporting failed after payment.
    console.error("NMI payment approved but reporting failed", result.transactionId, cause instanceof Error ? cause.message : cause);
  }

  const redirect = new URL(offer.redirect, request.url);
  if (shop) redirect.searchParams.set("shop", shop);
  if (resolvedLeadId) redirect.searchParams.set("lead", String(resolvedLeadId));
  redirect.searchParams.set("paid", "1");
  return NextResponse.json({ ok: true, redirect: redirect.pathname + redirect.search });
}
