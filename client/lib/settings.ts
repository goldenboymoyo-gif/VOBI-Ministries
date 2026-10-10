import "server-only";

import { cacheLife } from "next/cache";

import { site } from "@/config/site";
import { configured, load } from "@/lib/store";
import { getNewTvItems } from "@/lib/liveArchive";
import type { Ministry } from "@/types";

export type VideoEntry = { id: string; title: string; cat: string; src?: string; poster?: string };
export type VideoDetail = { date?: string; person?: string; place?: string; description?: string };
export type PageEntry = { slug: string; title: string; intro: string; body: string[] };
export type Settings = {
  heroVideo?: string;
  heroImage?: string;
  heroVideoFile?: string;
  announcement?: string;
  aboutWho?: string;
  videos?: VideoEntry[];
  hiddenVideos?: string[];
  imported?: VideoEntry[];
  details?: Record<string, VideoDetail>;
  contact?: { phone?: string; prayerPhone?: string; email?: string; address?: string; serviceTime?: string };
  notes?: { store?: string; give?: string; visit?: string };
  ministries?: Ministry[];
  story?: { year: string; title: string; body: string }[];
  beliefs?: { t: string; d: string }[];
  menu?: { label: string; href: string }[];
  pages?: PageEntry[];
};

/** Content edited from the admin page, kept in the VOBI-Data repo. Falls back to nothing when not set up. */
export async function getSettings(): Promise<Settings> {
  "use cache";
  cacheLife({ stale: 30, revalidate: 60, expire: 3600 });
  if (!configured()) return {};
  try {
    const [s, imported] = await Promise.all([load<Settings>("settings.json", {}), load<VideoEntry[]>("tv.json", [])]);
    // New YouTube uploads are added automatically; anything already imported or added by hand keeps its own entry.
    const known = new Set([...imported.map((i) => i.id), ...(s.videos ?? []).map((v) => v.id)]);
    const fresh = (await getNewTvItems()).filter((v) => !known.has(v.id));
    return { ...s, imported: [...fresh, ...imported] };
  } catch { return {}; }
}

/** The site details, with anything changed in the admin page applied on top. */
export async function getSite() {
  const c = (await getSettings()).contact ?? {};
  return {
    ...site,
    phone: c.phone || site.phone,
    prayerPhone: c.prayerPhone || site.prayerPhone,
    email: c.email || site.email,
    address: c.address || site.address,
    service: { ...site.service, time: c.serviceTime || site.service.time },
  };
}
