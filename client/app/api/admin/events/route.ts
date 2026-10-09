import { NextResponse } from "next/server";

import { isAdmin } from "@/lib/adminAuth";
import { clean, load, uid, update } from "@/lib/store";
import type { ChurchEvent } from "@/types";

const FILE = "events.json";

export async function GET(req: Request) {
  if (!isAdmin(req)) return NextResponse.json({ error: "No" }, { status: 401 });
  return NextResponse.json({ events: await load<ChurchEvent[]>(FILE, []) });
}

export async function POST(req: Request) {
  if (!isAdmin(req)) return NextResponse.json({ error: "No" }, { status: 401 });
  const b = (await req.json().catch(() => ({}))) as Record<string, string>;
  const title = clean(b.title, 120), date = clean(b.date, 10);
  if (!title || !/^\d{4}-\d{2}-\d{2}$/.test(date)) return NextResponse.json({ error: "Title and date are needed" }, { status: 400 });
  const id = uid();
  const ev: ChurchEvent = { id, slug: id, title, date, time: clean(b.time, 20) || null, location: clean(b.location, 120) || null, description: clean(b.description, 500) };
  await update<ChurchEvent[]>(FILE, [], (d) => [...d, ev]);
  return NextResponse.json({ event: ev });
}

export async function DELETE(req: Request) {
  if (!isAdmin(req)) return NextResponse.json({ error: "No" }, { status: 401 });
  const { id } = (await req.json().catch(() => ({}))) as { id?: string };
  if (!id) return NextResponse.json({ error: "Bad request" }, { status: 400 });
  await update<ChurchEvent[]>(FILE, [], (d) => d.filter((e) => e.id !== id));
  return NextResponse.json({ ok: true });
}
