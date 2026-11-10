import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { connectedShop, createPageIfMissing } from "@/lib/shopify-admin";
import { normalizeShop } from "@/lib/shopify";

const standardPages = [
  { title: "About Us", handle: "about-us", body: "<h1>About Us</h1><p>Welcome to our store. We are committed to offering a simple, dependable shopping experience and carefully selected products.</p>" },
  { title: "Contact Us", handle: "contact-us", body: "<h1>Contact Us</h1><p>Questions about an order or product? Contact our support team and we will be happy to help.</p>" },
  { title: "Shipping Policy", handle: "shipping-policy", body: "<h1>Shipping Policy</h1><p>Shipping times and tracking availability vary by product and destination. Tracking details are provided when available.</p>" },
  { title: "Returns & Refunds", handle: "returns-refunds", body: "<h1>Returns &amp; Refunds</h1><p>Please contact support before returning an item. Eligibility and instructions depend on the product and order status.</p>" }
];

export async function POST(request: NextRequest) {
  const form = await request.formData();
  const shopDomain = normalizeShop(String(form.get("shop") || ""));
  if (!shopDomain) return NextResponse.redirect(new URL("/connect?error=invalid", request.url), 303);

  const sql = db();
  const shop = await connectedShop(shopDomain);
  const jobs = await sql`
    insert into build_jobs (shop_id, plan, status, progress, current_step)
    values (${shop.id}, ${shop.plan}, 'building', 10, 'Checking Shopify connection')
    returning id
  `;
  const jobId = String(jobs[0].id);

  try {
    await sql`update shops set build_status = 'building', build_error = null, build_started_at = now(), updated_at = now() where id = ${shop.id}`;
    const pageIds: string[] = [];
    for (let index = 0; index < standardPages.length; index += 1) {
      const page = standardPages[index];
      await sql`update build_jobs set progress = ${20 + index * 15}, current_step = ${`Creating ${page.title}`}, updated_at = now() where id = ${jobId}`;
      pageIds.push(await createPageIfMissing(shop, page));
    }
    await sql`
      update build_jobs
      set status = 'complete', progress = 100, current_step = 'Store foundation complete', result = ${JSON.stringify({ pageIds })}::jsonb, completed_at = now(), updated_at = now()
      where id = ${jobId}
    `;
    await sql`update shops set build_status = 'complete', build_completed_at = now(), updated_at = now() where id = ${shop.id}`;
    return NextResponse.redirect(new URL(`/build/complete?shop=${encodeURIComponent(shopDomain)}`, request.url), 303);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Store build failed";
    await sql`update build_jobs set status = 'error', error = ${message}, current_step = 'Build stopped', updated_at = now() where id = ${jobId}`;
    await sql`update shops set build_status = 'error', build_error = ${message}, updated_at = now() where id = ${shop.id}`;
    return NextResponse.redirect(new URL(`/build?shop=${encodeURIComponent(shopDomain)}&error=build`, request.url), 303);
  }
}
