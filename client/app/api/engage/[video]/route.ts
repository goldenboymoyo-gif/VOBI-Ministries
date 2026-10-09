import { NextResponse } from "next/server";

import { clean, configured, load, throttle, uid, update, type Comment } from "@/lib/store";

const ok = (v: string) => /^[\w-]{3,24}$/.test(v);
type Ctx = { params: Promise<{ video: string }> };

export async function GET(_: Request, { params }: Ctx) {
  const { video } = await params;
  if (!ok(video) || !configured()) return NextResponse.json({ off: true }, { status: 503 });
  const [likes, comments] = await Promise.all([load<Record<string, number>>("likes.json", {}), load<Record<string, Comment[]>>("comments.json", {})]);
  return NextResponse.json({ likes: likes[video] ?? 0, comments: (comments[video] ?? []).slice(-100).reverse() });
}

export async function POST(req: Request, { params }: Ctx) {
  const { video } = await params;
  if (!ok(video) || !configured()) return NextResponse.json({ off: true }, { status: 503 });
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0] ?? "x";
  if (!throttle(`e:${ip}`, 8, 60_000)) return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  const b = (await req.json().catch(() => ({}))) as { type?: string; name?: string; text?: string; hp?: string };
  if (b.hp) return NextResponse.json({ ok: true });
  if (b.type === "like") {
    const all = await update<Record<string, number>>("likes.json", {}, (d) => ({ ...d, [video]: (d[video] ?? 0) + 1 }));
    return NextResponse.json({ likes: all[video] });
  }
  const text = clean(b.text, 500), name = clean(b.name, 40) || "Guest";
  if (!text) return NextResponse.json({ error: "Write a comment first" }, { status: 400 });
  const c: Comment = { id: uid(), name, text, at: Date.now() };
  await update<Record<string, Comment[]>>("comments.json", {}, (d) => ({ ...d, [video]: [...(d[video] ?? []), c].slice(-300) }));
  return NextResponse.json({ comment: c });
}
