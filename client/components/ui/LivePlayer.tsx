"use client";

import { useEffect, useRef, useState } from "react";

/** Live video frame with its own fullscreen button: fills the screen in landscape on phones. */
export function LivePlayer({ src, title }: { src: string; title: string }) {
  const box = useRef<HTMLDivElement>(null);
  const [full, setFull] = useState(false);
  const [soft, setSoft] = useState(false); // fallback when the browser cannot fullscreen an element (iPhone)

  useEffect(() => {
    const on = () => {
      const f = !!document.fullscreenElement;
      setFull(f);
      if (!f) { try { screen.orientation.unlock(); } catch {} }
    };
    document.addEventListener("fullscreenchange", on);
    return () => document.removeEventListener("fullscreenchange", on);
  }, []);

  useEffect(() => {
    document.documentElement.style.overflow = soft ? "hidden" : "";
    return () => { document.documentElement.style.overflow = ""; };
  }, [soft]);

  async function toggle() {
    const el = box.current; if (!el) return;
    if (soft) { setSoft(false); return; }
    if (document.fullscreenElement) { await document.exitFullscreen().catch(() => {}); return; }
    try {
      await el.requestFullscreen();
      try { await (screen.orientation as unknown as { lock: (o: string) => Promise<void> }).lock("landscape"); } catch {}
    } catch { setSoft(true); }
  }

  const on = full || soft;
  return (
    <div ref={box}
      className={soft
        ? "fixed left-1/2 top-1/2 z-[100] h-[100vw] w-[100dvh] -translate-x-1/2 -translate-y-1/2 rotate-90 bg-black landscape:h-[100dvh] landscape:w-[100vw] landscape:rotate-0"
        : full ? "relative h-full w-full bg-black" : "relative aspect-video w-full overflow-hidden bg-black md:rounded-xl"}>
      {/* No "fullscreen" permission on purpose: the only fullscreen control is ours, so it always goes landscape. */}
      <iframe className="absolute inset-0 h-full w-full border-0" src={src} title={title} allow="autoplay; encrypted-media; picture-in-picture" />
      <button type="button" onClick={toggle} aria-label={on ? "Exit full screen" : "Full screen"} className="absolute right-2 top-2 z-10 grid h-10 w-10 place-items-center rounded-full bg-black/60 text-white backdrop-blur hover:bg-black/80">
        <svg viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current" strokeWidth="2" aria-hidden>
          {on ? <path d="M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5" /> : <path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" />}
        </svg>
      </button>
    </div>
  );
}
