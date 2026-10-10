import "server-only";

import { cacheLife } from "next/cache";

import { site } from "@/config/site";
import { configured, load as loadStore } from "@/lib/store";
import { getSettings as getAdminSettings } from "@/lib/settings";
import { seedSermons, seedServices } from "@/content/sermons";
import { getNewSermons, getPastLiveStreams } from "@/lib/liveArchive";
import { seedMinistries } from "@/content/ministries";
import { seedTestimonies } from "@/content/testimonies";
import { seedEvents } from "@/content/events";
import type {
  ChurchEvent,
  Ministry,
  Sermon,
  SiteSettings,
  Testimony,
} from "@/types";

const API = process.env.VOBI_API_URL ?? "http://localhost:4000";

async function fromApi<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${API}${path}`, {
      headers: { accept: "application/json" },
      signal: AbortSignal.timeout(4000),
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    // API not running (or unreachable at build time), fall back to seed data.
    return null;
  }
}

export async function getSettings(): Promise<SiteSettings> {
  "use cache";
  cacheLife("minutes");
  return (await fromApi<SiteSettings>("/api/settings")) ?? site;
}

export async function getSermons(): Promise<Sermon[]> {
  "use cache";
  cacheLife("minutes");
  const rows = await fromApi<Sermon[]>("/api/sermons");
  const base = rows?.length ? rows : [...seedServices, ...seedSermons];
  // Recordings of finished live services are added automatically.
  const live = [...(await getPastLiveStreams()), ...(await getNewSermons())].filter((l) => l.date && !base.some((b) => b.id === l.id));
  return sortByDateDesc([...base, ...live]);
}

export async function getSermon(slug: string): Promise<Sermon | undefined> {
  "use cache";
  cacheLife("minutes");
  const all = await getSermons();
  return all.find((s) => s.slug === slug);
}

export async function getEvents(): Promise<ChurchEvent[]> {
  "use cache";
  cacheLife("minutes");
  const rows = await fromApi<ChurchEvent[]>("/api/events");
  let added: ChurchEvent[] = [];
  if (configured()) { try { added = await loadStore<ChurchEvent[]>("events.json", []); } catch {} }
  return sortByEventDate([...(rows ?? seedEvents), ...added]);
}

export async function getEvent(slug: string): Promise<ChurchEvent | undefined> {
  "use cache";
  cacheLife("minutes");
  const rows = await getEvents();
  return rows.find((e) => e.slug === slug);
}

export async function getMinistries(): Promise<Ministry[]> {
  "use cache";
  cacheLife("minutes");
  const custom = (await getAdminSettings()).ministries;
  if (custom?.length) return custom;
  const rows = await fromApi<Ministry[]>("/api/ministries");
  if (rows?.length) return rows;
  return seedMinistries;
}

export async function getMinistry(slug: string): Promise<Ministry | undefined> {
  "use cache";
  cacheLife("minutes");
  const rows = await getMinistries();
  return rows.find((m) => m.slug === slug);
}

export async function getTestimonies(): Promise<Testimony[]> {
  "use cache";
  cacheLife("hours");
  const rows = await fromApi<Testimony[]>("/api/testimonies");
  if (rows?.length) return rows;
  return seedTestimonies;
}

export function sortByDateDesc<T extends { date: string }>(rows: T[]): T[] {
  return [...rows].sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
}

function sortByEventDate(rows: ChurchEvent[]): ChurchEvent[] {
  return [...rows].sort((a, b) => (a.date > b.date ? 1 : a.date < b.date ? -1 : 0));
}
