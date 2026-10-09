import { NextResponse } from "next/server";

import { isAdmin } from "@/lib/adminAuth";
import { clean, load, update } from "@/lib/store";
import type { Settings } from "@/lib/settings";

const FILE = "settings.json";
const CATS = ["sermons", "testimony", "prophecy", "massprayer", "funny"];

function ytId(s: string) {
  const t = s.trim();
  if (/^[\w-]{11}$/.test(t)) return t;
  return t.match(/(?:v=|youtu\.be\/|embed\/|shorts\/|live\/)([\w-]{11})/)?.[1] ?? "";
}

export async function GET(req: Request) {
  if (!isAdmin(req)) return NextResponse.json({ error: "No" }, { status: 401 });
  return NextResponse.json({ settings: await load<Settings>(FILE, {}) });
}

export async function POST(req: Request) {
  if (!isAdmin(req)) return NextResponse.json({ error: "No" }, { status: 401 });
  const b = (await req.json().catch(() => ({}))) as Record<string, string>;

  if (b.action === "save") {
    const heroVideo = b.heroVideo ? ytId(b.heroVideo) : "";
    if (b.heroVideo && !heroVideo) return NextResponse.json({ error: "That is not a YouTube link" }, { status: 400 });
    const heroImage = clean(b.heroImage, 400);
    if (heroImage && !/^https:\/\/\S+$/.test(heroImage)) return NextResponse.json({ error: "The image link must start with https://" }, { status: 400 });
    const next = await update<Settings>(FILE, {}, (d) => ({
      ...d, heroVideo, heroImage, announcement: clean(b.announcement, 200),
      aboutWho: String(b.aboutWho ?? "").slice(0, 3000),
    }));
    return NextResponse.json({ settings: next });
  }
  if (b.action === "addVideo") {
    const id = ytId(b.url ?? ""), title = clean(b.title, 150);
    if (!id || !title || !CATS.includes(b.cat)) return NextResponse.json({ error: "Give a YouTube link, a title and a category" }, { status: 400 });
    const next = await update<Settings>(FILE, {}, (d) => ({ ...d, videos: [{ id, title, cat: b.cat }, ...(d.videos ?? []).filter((v) => v.id !== id)] }));
    return NextResponse.json({ settings: next });
  }
  if (b.action === "removeVideo") {
    const next = await update<Settings>(FILE, {}, (d) => ({ ...d, videos: (d.videos ?? []).filter((v) => v.id !== b.id) }));
    return NextResponse.json({ settings: next });
  }
  return NextResponse.json({ error: "Bad request" }, { status: 400 });
}
