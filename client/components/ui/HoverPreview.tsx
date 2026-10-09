"use client";

import { useRef, useState, type ReactNode } from "react";

export function ytId(u: string) {
  return u.match(/\/vi\/([\w-]{11})/)?.[1];
}

/** Plays a short muted clip when the pointer rests on a thumbnail, like a video-site hover preview. */
export function HoverPreview({ thumb, className = "", children }: { thumb: string; className?: string; children: ReactNode }) {
  const id = ytId(thumb);
  const [on, setOn] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const timer = useRef<number | undefined>(undefined);
  return (
    <span
      className={`relative block overflow-hidden ${className}`}
      onMouseEnter={() => {
        if (!id || !window.matchMedia("(hover: hover)").matches) return;
        timer.current = window.setTimeout(() => setOn(true), 250);
      }}
      onMouseLeave={() => { window.clearTimeout(timer.current); setOn(false); setLoaded(false); }}
    >
      {children}
      {on && id && (
        <iframe
          title="Preview"
          aria-hidden
          tabIndex={-1}
          onLoad={() => window.setTimeout(() => setLoaded(true), 700)}
          allow="autoplay"
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&mute=1&controls=0&disablekb=1&modestbranding=1&playsinline=1&rel=0&iv_load_policy=3&start=40&end=75&loop=1&playlist=${id}`}
          className={`pointer-events-none absolute inset-0 h-full w-full border-0 transition-opacity duration-500 ${loaded ? "opacity-100" : "opacity-0"}`}
        />
      )}
      {on && <span className="pointer-events-none absolute inset-x-0 bottom-0 h-1 bg-white/30"><span className="block h-full origin-left animate-[hp_35s_linear_forwards] bg-red-600" /></span>}
      <span className={`pointer-events-none absolute bottom-3 left-3 grid h-9 w-9 place-items-center rounded-full bg-black/60 text-white transition-opacity ${loaded ? "opacity-0" : "opacity-100"}`}>
        <svg viewBox="0 0 24 24" className="ml-0.5 h-4 w-4 fill-current" aria-hidden><path d="M8 5v14l11-7z" /></svg>
      </span>
    </span>
  );
}
