"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

type YTPlayer = {
  playVideo(): void; pauseVideo(): void; seekTo(s: number, allow: boolean): void;
  getCurrentTime(): number; getDuration(): number; mute(): void; unMute(): void; destroy(): void;
};
declare global {
  interface Window {
    YT?: { Player: new (el: HTMLElement, o: unknown) => YTPlayer };
    onYouTubeIframeAPIReady?: () => void;
  }
}

let apiPromise: Promise<void> | null = null;
function loadApi(): Promise<void> {
  if (window.YT?.Player) return Promise.resolve();
  if (!apiPromise) {
    apiPromise = new Promise((resolve) => {
      const prev = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => { prev?.(); resolve(); };
      const s = document.createElement("script");
      s.src = "https://www.youtube.com/iframe_api";
      document.head.appendChild(s);
    });
  }
  return apiPromise;
}

const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

/** Plays a video on this site with our own controls, so viewers never leave or see the host's interface. */
export function VideoPlayer({ id, title, poster }: { id: string; title: string; poster: string }) {
  const wrap = useRef<HTMLDivElement>(null);
  const host = useRef<HTMLDivElement>(null);
  const player = useRef<YTPlayer | null>(null);
  const [started, setStarted] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [t, setT] = useState(0);
  const [dur, setDur] = useState(0);

  useEffect(() => {
    if (!started) return;
    const iv = window.setInterval(() => {
      const p = player.current;
      if (p && typeof p.getCurrentTime === "function") { setT(p.getCurrentTime()); setDur(p.getDuration()); }
    }, 500);
    return () => window.clearInterval(iv);
  }, [started]);

  useEffect(() => () => { try { player.current?.destroy(); } catch {} }, []);

  async function start() {
    setStarted(true);
    await loadApi();
    if (!host.current || !window.YT) return;
    const el = document.createElement("div");
    host.current.appendChild(el);
    player.current = new window.YT.Player(el, {
      videoId: id,
      playerVars: { controls: 0, rel: 0, modestbranding: 1, iv_load_policy: 3, disablekb: 1, fs: 0, playsinline: 1, autoplay: 1 },
      events: {
        onReady: (e: { target: YTPlayer }) => e.target.playVideo(),
        onStateChange: (e: { data: number }) => setPlaying(e.data === 1 || e.data === 3),
      },
    });
  }

  function toggle() {
    if (!started) return void start();
    const p = player.current; if (!p) return;
    if (playing) p.pauseVideo(); else p.playVideo();
  }

  return (
    <div ref={wrap} className="relative aspect-video w-full overflow-hidden bg-black [&_iframe]:h-full [&_iframe]:w-full">
      <div ref={host} className="absolute inset-0" />
      {/* Blocks clicks reaching the host player's own buttons and links */}
      <button type="button" aria-label={playing ? `Pause ${title}` : `Play ${title}`} onClick={toggle} className="absolute inset-0 z-10 cursor-pointer" />
      {!playing && (
        <div className="pointer-events-none absolute inset-0 z-20 bg-black">
          <Image src={poster} alt={title} fill sizes="100vw" className="object-cover opacity-80" />
          <span className="absolute inset-0 grid place-items-center">
            <span className="grid h-20 w-20 place-items-center rounded-full bg-gold-bright text-ink shadow-xl">
              <svg viewBox="0 0 24 24" className="ml-1 h-8 w-8 fill-current" aria-hidden><path d="M8 5v14l11-7z" /></svg>
            </span>
          </span>
        </div>
      )}
      {started && playing && (
        <div className="absolute inset-x-0 bottom-0 z-30 flex items-center gap-3 bg-gradient-to-t from-black/80 to-transparent px-4 pb-3 pt-8 text-white">
          <button type="button" onClick={toggle} aria-label="Pause" className="text-sm font-bold">❚❚</button>
          <input type="range" min={0} max={dur || 1} step={1} value={Math.min(t, dur || 1)} aria-label="Seek"
            onChange={(e) => { const v = Number(e.target.value); setT(v); player.current?.seekTo(v, true); }}
            className="h-1 flex-1 cursor-pointer accent-[#e6c453]" />
          <span className="text-xs tabular-nums">{fmt(t)} / {fmt(dur)}</span>
          <button type="button" aria-label={muted ? "Unmute" : "Mute"} className="text-xs font-semibold"
            onClick={() => { const p = player.current; if (!p) return; if (muted) p.unMute(); else p.mute(); setMuted(!muted); }}>
            {muted ? "Unmute" : "Mute"}
          </button>
          <button type="button" aria-label="Full screen" className="text-xs font-semibold"
            onClick={() => { const w = wrap.current; if (!w) return; if (document.fullscreenElement) void document.exitFullscreen(); else void w.requestFullscreen(); }}>
            Full screen
          </button>
        </div>
      )}
    </div>
  );
}
