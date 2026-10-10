"use client";

import { useEffect, useState } from "react";

import { Countdown, nextService } from "@/components/ui/Countdown";
import { site } from "@/config/site";
import { Engage } from "@/components/ui/Engage";
import { LiveChat } from "@/components/ui/LiveChat";

const CHANNEL = "UCAFcgnT0wjnwlRQarojjuIQ";

export function LiveGate() {
  const [now, setNow] = useState<number | null>(null);
  const [yt, setYt] = useState<{ configured: boolean; live: boolean; id?: string; title?: string } | null>(null);
  useEffect(() => {
    let off = false;
    const check = () => fetch("/api/live").then((r) => r.json()).then((d) => { if (!off) setYt(d); }).catch(() => { if (!off) setYt({ configured: false, live: false }); });
    check();
    const id = window.setInterval(check, 60_000);
    return () => { off = true; window.clearInterval(id); };
  }, []);
  useEffect(() => {
    setNow(Date.now());
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  if (now === null) return <div className="aspect-video w-full bg-ink-800" aria-hidden />;
  const { start, live: scheduled } = nextService(now);
  // With the YouTube API configured, YouTube decides. Without it, the Sunday schedule does.
  const live = yt?.configured ? yt.live : scheduled;
  const src = yt?.live && yt.id ? `https://www.youtube-nocookie.com/embed/${yt.id}?autoplay=1&rel=0&modestbranding=1&playsinline=1` : `https://www.youtube-nocookie.com/embed/live_stream?channel=${CHANNEL}&autoplay=1&rel=0&modestbranding=1&playsinline=1`;

  if (live) {
    return (
      <div className="rounded-2xl bg-[#0f0f0f] p-3 text-white md:p-5">
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_380px]">
          <div>
            <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-black">
              <iframe
                className="absolute inset-0 h-full w-full border-0"
                src={src}
                title={yt?.title || "VOBI live service"}
                allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                allowFullScreen
              />
            </div>
            <h2 className="mt-4 text-lg font-bold leading-snug md:text-xl">{yt?.title || "VOBI Sunday Service"}</h2>
            <p className="mt-2 inline-flex items-center gap-2 text-sm text-white/70">
              <span className="inline-flex items-center gap-1.5 rounded bg-red-600 px-2 py-0.5 text-xs font-bold uppercase text-white"><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" /> Live</span>
              Valley of Blessings International Ministries
            </p>
          </div>
          <LiveChat className="h-[460px] lg:h-auto lg:max-h-[640px] lg:min-h-[420px]" />
        </div>
        <Engage videoId="live" dark className="mt-6" />
      </div>
    );
  }

  const day = new Date(start).toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", timeZone: "Africa/Harare" });
  return (
    <div className="rounded bg-white px-6 py-12 text-center text-ink shadow-lg md:py-16">
      <p className="text-sm font-semibold uppercase tracking-[0.1em] text-muted">The live service is not on right now</p>
      <h2 className="mt-3 text-2xl font-extrabold uppercase md:text-3xl">Live starts {day}</h2>
      <p className="mt-2 text-muted">at {site.service.time}, Zimbabwe time</p>
      <div className="mt-8 flex justify-center"><Countdown variant="card" /></div>
      <p className="mt-8 text-muted">Watch our recent services below while you wait.</p>
    </div>
  );
}
