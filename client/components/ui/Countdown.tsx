"use client";

import { useEffect, useState } from "react";

// Services: Sundays 08:30 Africa/Harare (UTC+2, no DST) = 06:30 UTC.
const LIVE_WINDOW_MS = 5 * 60 * 60 * 1000;

function nextService(now: number): { start: number; live: boolean } {
  const d = new Date(now);
  const start = Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), 6, 30);
  const daysToSunday = (7 - d.getUTCDay()) % 7;
  let t = start + daysToSunday * 86400000;
  if (now >= t && now < t + LIVE_WINDOW_MS) return { start: t, live: true };
  if (now >= t + LIVE_WINDOW_MS) t += 7 * 86400000;
  return { start: t, live: false };
}

export function Countdown() {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    const tick = () => setNow(Date.now());
    const first = requestAnimationFrame(tick);
    const id = window.setInterval(tick, 1000);
    return () => {
      cancelAnimationFrame(first);
      window.clearInterval(id);
    };
  }, []);

  if (now === null) return <div className="h-[5.5rem]" aria-hidden />;
  const { start, live } = nextService(now);

  if (live) {
    return (
      <a href="/live" className="inline-flex items-center gap-3 bg-red-600 px-6 py-4 text-sm font-bold uppercase tracking-[0.18em] text-white">
        <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-white" />
        We are live now — join the service
      </a>
    );
  }

  const diff = Math.max(0, start - now);
  const parts = [
    ["Days", Math.floor(diff / 86400000)],
    ["Hours", Math.floor(diff / 3600000) % 24],
    ["Minutes", Math.floor(diff / 60000) % 60],
    ["Seconds", Math.floor(diff / 1000) % 60],
  ] as const;

  return (
    <div>
      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-gold-bright">
        Next service · Sunday 08:30
      </p>
      <div className="flex gap-3 sm:gap-4" role="timer" aria-label="Time until the next Sunday service">
        {parts.map(([label, v]) => (
          <div key={label} className="min-w-[4.2rem] border border-paper/25 bg-ink/50 px-3 py-3 text-center backdrop-blur-sm sm:min-w-[5.5rem]">
            <div className="font-display text-3xl font-semibold tabular-nums sm:text-5xl">{String(v).padStart(2, "0")}</div>
            <div className="mt-1 text-[10px] uppercase tracking-[0.18em] text-paper/70">{label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
