import { connection } from "next/server";
import { NextResponse } from "next/server";

const CHANNEL = "UCAFcgnT0wjnwlRQarojjuIQ";
const API = "https://www.googleapis.com/youtube/v3";

type Item = { id: string; snippet?: { title?: string; liveBroadcastContent?: string; thumbnails?: { high?: { url?: string } } } };

/**
 * Asks the official YouTube Data API whether the channel is live.
 * Costs about 2 quota units per refresh and is cached for 60 seconds, so it stays well inside the free daily quota.
 * Without YOUTUBE_API_KEY it reports { configured: false } and the page falls back to the Sunday schedule.
 */
export async function GET() {
  await connection();
  const key = process.env.YOUTUBE_API_KEY;
  const headers = { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=60" };
  if (!key) return NextResponse.json({ configured: false, live: false }, { headers });
  try {
    const uploads = "UU" + CHANNEL.slice(2);
    const pl = await fetch(`${API}/playlistItems?part=contentDetails&maxResults=6&playlistId=${uploads}&key=${key}`, { next: { revalidate: 60 }, signal: AbortSignal.timeout(6000) });
    if (!pl.ok) throw new Error(`playlist ${pl.status}`);
    const ids = ((await pl.json()).items ?? []).map((i: { contentDetails: { videoId: string } }) => i.contentDetails.videoId).join(",");
    if (!ids) return NextResponse.json({ configured: true, live: false }, { headers });
    const vd = await fetch(`${API}/videos?part=snippet&id=${ids}&key=${key}`, { next: { revalidate: 60 }, signal: AbortSignal.timeout(6000) });
    if (!vd.ok) throw new Error(`videos ${vd.status}`);
    const live = ((await vd.json()).items as Item[] | undefined)?.find((v) => v.snippet?.liveBroadcastContent === "live");
    if (!live) return NextResponse.json({ configured: true, live: false }, { headers });
    return NextResponse.json({ configured: true, live: true, id: live.id, title: live.snippet?.title ?? "", thumb: live.snippet?.thumbnails?.high?.url ?? "" }, { headers });
  } catch {
    // YouTube unavailable: tell the page so it can fall back to the schedule instead of showing a wrong state.
    return NextResponse.json({ configured: false, live: false, error: true }, { headers: { "Cache-Control": "no-store" } });
  }
}
