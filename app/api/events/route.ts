import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const event = String(body.event || "").slice(0, 100);
  if (!event) return NextResponse.json({ error: "Event is required" }, { status: 400 });
  const sql = db();
  await sql`insert into funnel_events (event_name, properties) values (${event}, ${JSON.stringify(body)}::jsonb)`;
  return NextResponse.json({ ok: true });
}
