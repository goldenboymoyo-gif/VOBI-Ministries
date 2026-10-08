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

export function Countdown({ variant = "dark" }: { variant?: "dark" | "card" }) {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    setNow(Date.now());
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  if (now === null) return <div className="h-[5.5rem]" aria-hidden />;
  const { start, live } = nextService(now);

  if (live) {
    return (
      <a href="/live" className="inline-flex items-center gap-3 rounded bg-red-600 px-6 py-4 text-sm font-bold uppercase tracking-[0.12em] text-white">
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
  const card = variant === "card";

  return (
    <div className="flex gap-3" role="timer" aria-label="Time until the next Sunday service">
      {parts.map(([label, v]) => (
        <div key={label} className={`min-w-[4rem] rounded px-3 py-3 text-center sm:min-w-[5rem] ${card ? "bg-gold-bright text-ink" : "bg-ink/60 text-white"}`}>
          <div className="text-3xl font-bold tabular-nums sm:text-4xl">{String(v).padStart(2, "0")}</div>
          <div className={`mt-1 text-[11px] ${card ? "text-ink/70" : "text-white/70"}`}>{label}</div>
        </div>
      ))}
    </div>
  );
}
