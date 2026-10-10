import { NextResponse } from "next/server";

import { isAdmin } from "@/lib/adminAuth";
import { clean, update } from "@/lib/store";

const CATS = ["sermons", "testimony", "prophecy", "massprayer", "praise", "funny"];

/** Replaces the list of videos imported from the YouTube channel (VOBI TV). */
export async function POST(req: Request) {
  if (!isAdmin(req)) return NextResponse.json({ error: "No" }, { status: 401 });
  const b = (await req.json().catch(() => ({}))) as { videos?: { id?: string; title?: string; cat?: string }[] };
  const seen = new Set<string>();
  const videos = (Array.isArray(b.videos) ? b.videos : []).slice(0, 2000).map((v) => ({
    id: String(v.id ?? ""), title: clean(v.title, 120), cat: CATS.includes(String(v.cat)) ? String(v.cat) : "sermons",
  })).filter((v) => /^[\w-]{11}$/.test(v.id) && v.title && !seen.has(v.id) && seen.add(v.id));
  await update("tv.json", [], () => videos);
  return NextResponse.json({ ok: true, count: videos.length });
}
