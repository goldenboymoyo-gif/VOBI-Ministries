import "server-only";

import { cacheLife } from "next/cache";

import type { Sermon } from "@/types";

const CHANNEL = "UCAFcgnT0wjnwlRQarojjuIQ";
const API = "https://www.googleapis.com/youtube/v3";

type V = {
  id: string;
  snippet?: { title?: string; description?: string; thumbnails?: Record<string, { url: string }> };
  liveStreamingDetails?: { actualStartTime?: string; actualEndTime?: string };
};

/**
 * Finished live streams from the official channel (needs YOUTUBE_API_KEY).
 * When a live service ends, YouTube keeps the recording on the channel, and this picks it up
 * so it shows in the Sermons library and as the latest service without anyone uploading it again.
 * Refreshes about every 5 minutes. Without a key, or if YouTube is unavailable, it returns nothing.
 */
export async function getPastLiveStreams(): Promise<Sermon[]> {
  "use cache";
  cacheLife("minutes");
  const key = process.env.YOUTUBE_API_KEY;
  if (!key) return [];
  try {
    const pl = await fetch(`${API}/playlistItems?part=contentDetails&maxResults=25&playlistId=UU${CHANNEL.slice(2)}&key=${key}`, { signal: AbortSignal.timeout(6000) });
    if (!pl.ok) return [];
    const ids = ((await pl.json()).items ?? []).map((i: { contentDetails: { videoId: string } }) => i.contentDetails.videoId).join(",");
    if (!ids) return [];
    const vd = await fetch(`${API}/videos?part=snippet,liveStreamingDetails&id=${ids}&key=${key}`, { signal: AbortSignal.timeout(6000) });
    if (!vd.ok) return [];
    return (((await vd.json()).items ?? []) as V[])
      .filter((v) => v.liveStreamingDetails?.actualEndTime)
      .map((v) => {
        const t = v.snippet?.thumbnails ?? {};
        return {
          id: v.id,
          slug: v.id,
          title: v.snippet?.title ?? "Live service",
          speaker: "Prophet Promise",
          date: (v.liveStreamingDetails?.actualStartTime ?? v.liveStreamingDetails?.actualEndTime ?? "").slice(0, 10),
          thumbnail: (t.maxres ?? t.standard ?? t.high ?? t.medium)?.url ?? `https://i.ytimg.com/vi/${v.id}/hqdefault.jpg`,
          youtubeUrl: `https://www.youtube.com/watch?v=${v.id}`,
          category: "service" as const,
          description: v.snippet?.description?.slice(0, 600) || undefined,
        };
      });
  } catch {
    return [];
  }
}
