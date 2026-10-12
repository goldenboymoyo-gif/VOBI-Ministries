"use client";

import { useEffect, useRef, useState } from "react";

/** Live video frame with its own fullscreen: fills the screen and rotates to landscape on phones. */
export function LivePlayer({ src, title }: { src: string; title: string }) {
  const box = useRef<HTMLDivElement>(null);
  const [full, setFull] = useState(false);

  useEffect(() => {
    const on = () => {
      const f = !!document.fullscreenElement;
      setFull(f);
      if (!f) { try { screen.orientation.unlock(); } catch {} }
    };
    document.addEventListener("fullscreenchange", on);
    return () => document.removeEventListener("fullscreenchange", on);
  }, []);

  async function toggle() {
    const el = box.current; if (!el) return;
    if (document.fullscreenElement) { await document.exitFullscreen().catch(() => {}); return; }
    try {
      await el.requestFullscreen();
      try { await (screen.orientation as unknown as { lock: (o: string) => Promise<void> }).lock("landscape"); } catch {}
    } catch { setFull((v) => !v); }
  }

  return (
    <div ref={box} className={full ? "fixed inset-0 z-[100] bg-black" : "relative aspect-video w-full overflow-hidden rounded-xl bg-black"}>
      <iframe className="absolute inset-0 h-full w-full border-0" src={src} title={title} allow="autoplay; encrypted-media; picture-in-picture; fullscreen" />
      <button type="button" onClick={toggle} aria-label={full ? "Exit full screen" : "Full screen"} className="absolute right-2 top-2 z-10 grid h-9 w-9 place-items-center rounded-full bg-black/60 text-white backdrop-blur hover:bg-black/80">
        <svg viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current" strokeWidth="2" aria-hidden>
          {full ? <path d="M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5" /> : <path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" />}
        </svg>
      </button>
    </div>
  );
}
