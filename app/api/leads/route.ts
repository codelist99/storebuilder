import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const providedFirstName = String(body.firstName || "").trim();
  const providedLastName = String(body.lastName || "").trim();
  const fullName = String(body.fullName || `${providedFirstName} ${providedLastName}`).trim();
  const email = String(body.email || "").trim().toLowerCase();
  const phone = String(body.phone || "").trim();
  if (!fullName || !email || !phone) return NextResponse.json({ error: "Name, email and phone are required" }, { status: 400 });
  const pieces = fullName.split(/\s+/);
  const firstName = providedFirstName || pieces.shift() || fullName;
  const lastName = providedLastName || pieces.join(" ");
  const sql = db();
  const rows = await sql`insert into leads (first_name, last_name, email, phone, source) values (${firstName}, ${lastName}, ${email}, ${phone}, ${JSON.stringify(body.attribution || {})}::jsonb) returning id`;
  await sql`insert into funnel_events (lead_id, event_name, properties) values (${rows[0].id}, 'builder_optin', ${JSON.stringify({ destination: "store-color", ...body.attribution })}::jsonb)`;
  return NextResponse.json({ ok: true, leadId: rows[0].id });
}
