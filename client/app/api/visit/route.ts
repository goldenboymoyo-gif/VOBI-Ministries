import { createHmac } from "node:crypto";
import { NextResponse } from "next/server";

import { clean, configured, update } from "@/lib/store";

export type Day = { visitors: number; mobile: number; entry: Record<string, number>; from: Record<string, number>; seen: string[] };
export type Visits = Record<string, Day>;

const BOT = /bot|crawl|spider|slurp|preview|facebookexternalhit|headless|lighthouse|monitor|curl|wget/i;
const seenHere = new Set<string>();

/** Anonymous visitor counting: no cookies, no IP stored. A daily-changing hash only tells us a visitor was already counted today. */
export async function POST(req: Request) {
  if (!configured()) return NextResponse.json({ ok: true });
  const ua = req.headers.get("user-agent") ?? "";
  if (!ua || BOT.test(ua)) return NextResponse.json({ ok: true });
  const b = (await req.json().catch(() => ({}))) as { path?: string; ref?: string };
  const day = new Date(Date.now() + 2 * 3600_000).toISOString().slice(0, 10); // Zimbabwe time
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "x";
  const h = createHmac("sha256", `${process.env.ADMIN_PASSWORD ?? "vobi"}:${day}`).update(`${ip}|${ua}`).digest("hex").slice(0, 12);
  if (seenHere.has(`${day}:${h}`)) return NextResponse.json({ ok: true });
  seenHere.add(`${day}:${h}`); if (seenHere.size > 5000) seenHere.clear();
  const path = clean(b.path, 80).split("?")[0] || "/";
  const ref = clean(b.ref, 80).replace(/^www\./, "") || "direct";
  const mobile = /mobi|android|iphone|ipad/i.test(ua);
  await update<Visits>("visits.json", {}, (d) => {
    const cur = d[day] ?? { visitors: 0, mobile: 0, entry: {}, from: {}, seen: [] };
    if (cur.seen.includes(h)) return d;
    cur.seen.push(h); cur.visitors++; if (mobile) cur.mobile++;
    cur.entry[path] = (cur.entry[path] ?? 0) + 1; cur.from[ref] = (cur.from[ref] ?? 0) + 1;
    const out: Visits = { ...d, [day]: cur };
    Object.keys(out).sort().slice(0, Math.max(0, Object.keys(out).length - 60)).forEach((k) => delete out[k]);
    return out;
  });
  return NextResponse.json({ ok: true });
}
