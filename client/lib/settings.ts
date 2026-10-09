import "server-only";

import { cacheLife } from "next/cache";

import { configured, load } from "@/lib/store";

export type VideoEntry = { id: string; title: string; cat: string };
export type Settings = {
  heroVideo?: string;
  heroImage?: string;
  announcement?: string;
  aboutWho?: string;
  videos?: VideoEntry[];
};

/** Content edited from the admin page, kept in the VOBI-Data repo. Falls back to nothing when not set up. */
export async function getSettings(): Promise<Settings> {
  "use cache";
  cacheLife({ stale: 30, revalidate: 60, expire: 3600 });
  if (!configured()) return {};
  try { return await load<Settings>("settings.json", {}); } catch { return {}; }
}
