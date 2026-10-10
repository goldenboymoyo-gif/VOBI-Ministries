import { NextResponse } from "next/server";

import { isAdmin } from "@/lib/adminAuth";
import { clean, load, uid, update } from "@/lib/store";
import type { Settings } from "@/lib/settings";
import { site, nav } from "@/config/site";
import { seedMinistries } from "@/content/ministries";
import { story } from "@/content/story";
import { beliefs } from "@/content/beliefs";
import { tvItems } from "@/content/vobitv";
import type { ChurchEvent } from "@/types";

const FILE = "settings.json";
const CATS = ["sermons", "testimony", "prophecy", "massprayer", "praise", "funny"];
type Any = Record<string, unknown>;

function ytId(s: string) {
  const t = s.trim();
  if (/^[\w-]{11}$/.test(t)) return t;
  return t.match(/(?:v=|youtu\.be\/|embed\/|shorts\/|live\/)([\w-]{11})/)?.[1] ?? "";
}
const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60);
const imgOk = (u: string) => /^https:\/\/\S+$/.test(u) || /^\/(api\/media|photos|media)\/\S+$/.test(u);
const urlOk = (u: string) => /^https:\/\/\S+$/.test(u);
const paras = (v: unknown) =>
  (Array.isArray(v) ? v.map(String) : String(v ?? "").split(/\n\s*\n/)).map((p) => p.trim().slice(0, 1500)).filter(Boolean).slice(0, 12);
const arr = (v: unknown): Any[] => (Array.isArray(v) ? (v as Any[]).slice(0, 40) : []);

function lists(b: Any) {
  const seen = new Set<string>();
  const uniq = (base: string) => { let s = base || "item", n = 2; while (seen.has(s)) s = `${base}-${n++}`; seen.add(s); return s; };
  const ministries = arr(b.ministries).map((m) => {
    const name = clean(m.name, 80), image = clean(m.image, 400), slug = uniq(slugify(name));
    return { id: slug, slug, name, summary: clean(m.summary, 300), body: paras(m.body), image: imgOk(image) ? image : "/photos/worship.jpg", gathering: clean(m.gathering, 200) || null };
  }).filter((m) => m.name);
  const storyL = arr(b.story).map((e) => ({ year: clean(e.year, 20), title: clean(e.title, 120), body: clean(e.body, 800) })).filter((e) => e.title);
  const beliefsL = arr(b.beliefs).map((e) => ({ t: clean(e.t, 80), d: clean(e.d, 400) })).filter((e) => e.t);
  const menu = arr(b.menu).map((e) => ({ label: clean(e.label, 30), href: clean(e.href, 200) })).filter((e) => e.label && /^(\/|https:\/\/)/.test(e.href));
  const seenP = new Set<string>();
  const pages = arr(b.pages).map((p) => {
    const title = clean(p.title, 100); let slug = slugify(title) || "page", n = 2;
    while (seenP.has(slug)) slug = `${slugify(title)}-${n++}`; seenP.add(slug);
    return { slug, title, intro: clean(p.intro, 300), body: paras(p.body) };
  }).filter((p) => p.title);
  return { ministries, story: storyL, beliefs: beliefsL, menu, pages };
}

const same = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b);

export async function GET(req: Request) {
  if (!isAdmin(req)) return NextResponse.json({ error: "No" }, { status: 401 });
  const [settings, events] = await Promise.all([load<Settings>(FILE, {}), load<ChurchEvent[]>("events.json", [])]);
  const defaults = {
    ministries: seedMinistries, story, beliefs, tv: tvItems, hero: { image: "/photos/hero.jpg", video: "d5NuEDZKcZg" },
    menu: nav.map((n) => ({ label: n.label, href: n.href })),
    contact: { phone: site.phone, prayerPhone: site.prayerPhone, email: site.email, address: site.address, serviceTime: site.service.time },
  };
  return NextResponse.json({ settings, events, defaults });
}

/** Saves the whole content document the admin page edits. */
export async function PUT(req: Request) {
  if (!isAdmin(req)) return NextResponse.json({ error: "No" }, { status: 401 });
  const b = (await req.json().catch(() => ({}))) as Any;

  const heroVideo = String(b.heroVideo ?? "") ? ytId(String(b.heroVideo)) : "";
  if (String(b.heroVideo ?? "") && !heroVideo) return NextResponse.json({ error: "The hero video link is not a YouTube link" }, { status: 400 });
  const heroImage = clean(b.heroImage, 400);
  if (heroImage && !imgOk(heroImage)) return NextResponse.json({ error: "The hero picture must be uploaded or start with https://" }, { status: 400 });
  const heroVideoFile = clean(b.heroVideoFile, 400);
  if (heroVideoFile && !urlOk(heroVideoFile)) return NextResponse.json({ error: "Bad hero video file" }, { status: 400 });

  const videos = arr(b.videos).map((v) => {
    const src = clean(v.src, 400), poster = clean(v.poster, 400);
    const id = src ? clean(v.id, 24).replace(/[^\w-]/g, "") || uid() : ytId(String(v.id ?? ""));
    return { id, title: clean(v.title, 150), cat: CATS.includes(String(v.cat)) ? String(v.cat) : "sermons", ...(src && urlOk(src) ? { src } : {}), ...(poster && imgOk(poster) ? { poster } : {}) };
  }).filter((v) => v.id && v.title);

  const L = lists(b);
  const c = (b.contact ?? {}) as Any, n = (b.notes ?? {}) as Any;
  const dMin = lists({ ministries: seedMinistries }).ministries;
  const dStory = lists({ story }).story, dBel = lists({ beliefs }).beliefs;
  const dMenu = lists({ menu: nav.map((x) => ({ label: x.label, href: x.href })) }).menu;

  const next: Settings = {
    heroVideo, heroImage, heroVideoFile, hiddenVideos: (Array.isArray(b.hiddenVideos) ? (b.hiddenVideos as unknown[]) : []).map(String).filter((x) => /^[\w-]{6,24}$/.test(x)).slice(0, 400), announcement: clean(b.announcement, 200), aboutWho: String(b.aboutWho ?? "").slice(0, 3000), videos,
    contact: { phone: clean(c.phone, 30), prayerPhone: clean(c.prayerPhone, 30), email: clean(c.email, 80), address: clean(c.address, 160), serviceTime: clean(c.serviceTime, 10) },
    notes: { store: String(n.store ?? "").slice(0, 800), give: String(n.give ?? "").slice(0, 800), visit: String(n.visit ?? "").slice(0, 800) },
    ministries: same(L.ministries, dMin) ? [] : (L.ministries as Settings["ministries"]),
    story: same(L.story, dStory) ? [] : L.story,
    beliefs: same(L.beliefs, dBel) ? [] : L.beliefs,
    menu: same(L.menu, dMenu) ? [] : L.menu,
    pages: L.pages,
  };
  await update<Settings>(FILE, {}, () => next);

  const events: ChurchEvent[] = arr(b.events).map((e) => {
    const id = clean(e.id, 24).replace(/[^\w-]/g, "") || uid();
    return { id, slug: id, title: clean(e.title, 120), date: clean(e.date, 10), time: clean(e.time, 20) || null, location: clean(e.location, 120) || null, description: clean(e.description, 500) };
  }).filter((e) => e.title && /^\d{4}-\d{2}-\d{2}$/.test(e.date));
  await update<ChurchEvent[]>("events.json", [], () => events);
  return NextResponse.json({ ok: true });
}
