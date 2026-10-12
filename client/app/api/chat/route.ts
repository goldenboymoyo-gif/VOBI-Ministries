import { NextResponse, connection } from "next/server";

import { clean, configured, load, throttle, uid, update, type Msg } from "@/lib/store";


export async function GET(req: Request) {
  await connection();
  if (!configured()) return NextResponse.json({ off: true }, { status: 503 });
  const m = await load<Msg[]>("chat.json", []);
  const s = clean(new URL(req.url).searchParams.get("s"), 40) || "live";
  return NextResponse.json({ messages: m.filter((x) => x.s === s).slice(-60) });
}

export async function POST(req: Request) {
  if (!configured()) return NextResponse.json({ off: true }, { status: 503 });
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0] ?? "x";
  if (!throttle(`c:${ip}`, 6, 30_000)) return NextResponse.json({ error: "Slow down a little" }, { status: 429 });
  const b = (await req.json().catch(() => ({}))) as { name?: string; text?: string; s?: string };
  const text = clean(b.text, 200); if (!text) return NextResponse.json({ error: "Empty" }, { status: 400 });
  const m: Msg = { id: uid(), name: clean(b.name, 30) || "Guest", text, at: Date.now(), s: clean(b.s, 40) || "live" };
  await update<Msg[]>("chat.json", [], (d) => [...d, m].slice(-200));
  return NextResponse.json({ message: m });
}
