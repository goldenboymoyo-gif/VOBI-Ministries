import { NextResponse } from "next/server";

import { isAdmin } from "@/lib/adminAuth";
import { clean, load, update } from "@/lib/store";
import type { Settings } from "@/lib/settings";
import { site, nav } from "@/config/site";
import { seedMinistries } from "@/content/ministries";
import { story } from "@/content/story";
import { beliefs } from "@/content/beliefs";

const FILE = "settings.json";
const CATS = ["sermons", "testimony", "prophecy", "massprayer", "funny"];
type Any = Record<string, unknown>;

function ytId(s: string) {
  const t = s.trim();
  if (/^[\w-]{11}$/.test(t)) return t;
  return t.match(/(?:v=|youtu\.be\/|embed\/|shorts\/|live\/)([\w-]{11})/)?.[1] ?? "";
}
const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60);
const imgOk = (u: string) => /^https:\/\/\S+$/.test(u) || /^\/(api\/media|photos|media)\/\S+$/.test(u);
const paras = (v: unknown) =>
  (Array.isArray(v) ? v.map(String) : String(v ?? "").split(/\n\s*\n/)).map((p) => p.trim().slice(0, 1500)).filter(Boolean).slice(0, 12);

function cleanList(key: string, items: Any[]): unknown[] | null {
  const seen = new Set<string>();
  const uniq = (base: string) => { let s = base || "item", n = 2; while (seen.has(s)) s = `${base}-${n++}`; seen.add(s); return s; };
  const list = items.slice(0, 30);
  if (key === "ministries")
    return list.map((m) => {
      const name = clean(m.name, 80), image = clean(m.image, 400), slug = uniq(slugify(name));
      return { id: slug, slug, name, summary: clean(m.summary, 300), body: paras(m.body), image: imgOk(image) ? image : "/photos/worship.jpg", gathering: clean(m.gathering, 200) || null };
    }).filter((m) => m.name);
  if (key === "story")
    return list.map((e) => ({ year: clean(e.year, 20), title: clean(e.title, 120), body: clean(e.body, 800) })).filter((e) => e.title);
  if (key === "beliefs")
    return list.map((e) => ({ t: clean(e.t, 80), d: clean(e.d, 400) })).filter((e) => e.t);
  if (key === "menu")
    return list.map((e) => ({ label: clean(e.label, 30), href: clean(e.href, 200) })).filter((e) => e.label && /^(\/|https:\/\/)/.test(e.href));
  if (key === "pages")
    return list.map((p) => {
      const title = clean(p.title, 100);
      return { slug: uniq(slugify(title)), title, intro: clean(p.intro, 300), body: paras(p.body) };
    }).filter((p) => p.title);
  return null;
}

export async function GET(req: Request) {
  if (!isAdmin(req)) return NextResponse.json({ error: "No" }, { status: 401 });
  const defaults = {
    ministries: seedMinistries, story, beliefs,
    menu: nav.map((n) => ({ label: n.label, href: n.href })),
    contact: { phone: site.phone, prayerPhone: site.prayerPhone, email: site.email, address: site.address, serviceTime: site.service.time },
  };
  return NextResponse.json({ settings: await load<Settings>(FILE, {}), defaults });
}

export async function POST(req: Request) {
  if (!isAdmin(req)) return NextResponse.json({ error: "No" }, { status: 401 });
  const b = (await req.json().catch(() => ({}))) as Any;
  const str = (k: string) => String(b[k] ?? "");

  if (b.action === "save") {
    const heroVideo = str("heroVideo") ? ytId(str("heroVideo")) : "";
    if (str("heroVideo") && !heroVideo) return NextResponse.json({ error: "That is not a YouTube link" }, { status: 400 });
    const heroImage = clean(b.heroImage, 400);
    if (heroImage && !imgOk(heroImage)) return NextResponse.json({ error: "Upload a picture or use a link starting with https://" }, { status: 400 });
    const next = await update<Settings>(FILE, {}, (d) => ({ ...d, heroVideo, heroImage, announcement: clean(b.announcement, 200), aboutWho: str("aboutWho").slice(0, 3000) }));
    return NextResponse.json({ settings: next });
  }
  if (b.action === "saveMisc") {
    const c = (b.contact ?? {}) as Any, n = (b.notes ?? {}) as Any;
    const next = await update<Settings>(FILE, {}, (d) => ({
      ...d,
      contact: { phone: clean(c.phone, 30), prayerPhone: clean(c.prayerPhone, 30), email: clean(c.email, 80), address: clean(c.address, 160), serviceTime: clean(c.serviceTime, 10) },
      notes: { store: String(n.store ?? "").slice(0, 800), give: String(n.give ?? "").slice(0, 800), visit: String(n.visit ?? "").slice(0, 800) },
    }));
    return NextResponse.json({ settings: next });
  }
  if (b.action === "saveList" || b.action === "resetList") {
    const key = str("key");
    const items = b.action === "resetList" ? [] : cleanList(key, Array.isArray(b.items) ? (b.items as Any[]) : []);
    if (!items) return NextResponse.json({ error: "Bad request" }, { status: 400 });
    const next = await update<Settings>(FILE, {}, (d) => ({ ...d, [key]: items }));
    return NextResponse.json({ settings: next });
  }
  if (b.action === "addVideo") {
    const id = ytId(str("url")), title = clean(b.title, 150);
    if (!id || !title || !CATS.includes(str("cat"))) return NextResponse.json({ error: "Give a YouTube link, a title and a category" }, { status: 400 });
    const next = await update<Settings>(FILE, {}, (d) => ({ ...d, videos: [{ id, title, cat: str("cat") }, ...(d.videos ?? []).filter((v) => v.id !== id)] }));
    return NextResponse.json({ settings: next });
  }
  if (b.action === "removeVideo") {
    const next = await update<Settings>(FILE, {}, (d) => ({ ...d, videos: (d.videos ?? []).filter((v) => v.id !== b.id) }));
    return NextResponse.json({ settings: next });
  }
  return NextResponse.json({ error: "Bad request" }, { status: 400 });
}
