import "server-only";

import { cacheLife } from "next/cache";

import type { Sermon } from "@/types";

const CHANNEL = "UCAFcgnT0wjnwlRQarojjuIQ";
const API = "https://www.googleapis.com/youtube/v3";

type V = {
  id: string;
  snippet?: { title?: string; description?: string; publishedAt?: string; thumbnails?: Record<string, { url: string }> };
  liveStreamingDetails?: { actualStartTime?: string; actualEndTime?: string };
};
type Upload = { id: string; title: string; date: string; thumb: string; description?: string; live: boolean };

/**
 * The newest uploads on the official channel, read through the YouTube Data API (needs YOUTUBE_API_KEY).
 * New videos and recordings of finished live services appear on the site on their own, about 5 minutes after YouTube lists them.
 * Without a key, or if YouTube is unavailable, this returns nothing and the site shows what it already has.
 */
async function getUploads(): Promise<Upload[]> {
  "use cache";
  cacheLife("minutes");
  const key = process.env.YOUTUBE_API_KEY;
  if (!key) return [];
  try {
    const pl = await fetch(`${API}/playlistItems?part=contentDetails&maxResults=30&playlistId=UU${CHANNEL.slice(2)}&key=${key}`, { signal: AbortSignal.timeout(6000) });
    if (!pl.ok) return [];
    const ids = ((await pl.json()).items ?? []).map((i: { contentDetails: { videoId: string } }) => i.contentDetails.videoId).join(",");
    if (!ids) return [];
    const vd = await fetch(`${API}/videos?part=snippet,liveStreamingDetails&id=${ids}&key=${key}`, { signal: AbortSignal.timeout(6000) });
    if (!vd.ok) return [];
    return (((await vd.json()).items ?? []) as V[])
      // Skip streams that are still live or scheduled; they appear once they have ended.
      .filter((v) => !v.liveStreamingDetails || v.liveStreamingDetails.actualEndTime)
      .map((v) => {
        const t = v.snippet?.thumbnails ?? {};
        const when = v.liveStreamingDetails?.actualStartTime ?? v.snippet?.publishedAt ?? "";
        return {
          id: v.id,
          title: v.snippet?.title ?? "Video",
          date: when.slice(0, 10),
          thumb: (t.maxres ?? t.standard ?? t.high ?? t.medium)?.url ?? `https://i.ytimg.com/vi/${v.id}/hqdefault.jpg`,
          description: v.snippet?.description?.slice(0, 600) || undefined,
          live: Boolean(v.liveStreamingDetails),
        };
      })
      .filter((u) => u.date);
  } catch {
    return [];
  }
}

const asSermon = (u: Upload, category: "service" | "sermon"): Sermon => ({
  id: u.id, slug: u.id, title: u.title, speaker: "Prophet Promise", date: u.date, thumbnail: u.thumb,
  youtubeUrl: `https://www.youtube.com/watch?v=${u.id}`, category, description: u.description,
});

/** Finished live services, shown as services (latest service and the sermons library). */
export async function getPastLiveStreams(): Promise<Sermon[]> {
  return (await getUploads()).filter((u) => u.live).map((u) => asSermon(u, "service"));
}

/** New uploads titled as sermons. */
export async function getNewSermons(): Promise<Sermon[]> {
  return (await getUploads()).filter((u) => !u.live && /sermon/i.test(u.title)).map((u) => asSermon(u, "sermon"));
}

const catOf = (t: string) =>
  /testimon/i.test(t) ? "testimony" : /prophe/i.test(t) ? "prophecy" : /mass prayer|pray along|prayer/i.test(t) ? "massprayer"
  : /praise|worship|choir|song/i.test(t) ? "praise" : /funny|comedy/i.test(t) ? "funny" : "sermons";

/** Other new uploads, sorted into the VOBI TV tabs by title. They can be hidden or edited in the admin. */
export async function getNewTvItems(): Promise<{ id: string; title: string; cat: string; poster: string }[]> {
  return (await getUploads()).filter((u) => !u.live && !/sermon/i.test(u.title)).map((u) => ({ id: u.id, title: u.title, cat: catOf(u.title), poster: u.thumb }));
}
