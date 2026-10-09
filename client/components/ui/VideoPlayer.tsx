"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
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

const fmt = (s: number) => {
  const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sec = Math.floor(s % 60);
  return `${h ? `${h}:${String(m).padStart(2, "0")}` : m}:${String(sec).padStart(2, "0")}`;
};

type FsDoc = Document & { webkitFullscreenElement?: Element; webkitExitFullscreen?: () => void };
type FsEl = HTMLElement & { webkitRequestFullscreen?: () => void };

/** Plays a video on this site with our own controls, so viewers never leave or see the host's interface. */
export function VideoPlayer({ id, title, poster, next }: { id: string; title: string; poster: string; next?: { title: string; href: string } }) {
  const router = useRouter();
  const [left, setLeft] = useState<number | null>(null);
  const wrap = useRef<HTMLDivElement>(null);
  const host = useRef<HTMLDivElement>(null);
  const player = useRef<YTPlayer | null>(null);
  const wantPlay = useRef(false);
  const lastTap = useRef(0);
  const tapTimer = useRef<number | undefined>(undefined);
  const hideTimer = useRef<number | undefined>(undefined);
  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [started, setStarted] = useState(false);
  const [busy, setBusy] = useState(false);
  const [muted, setMuted] = useState(false);
  const [t, setT] = useState(0);
  const [dur, setDur] = useState(0);
  const [ui, setUi] = useState(true);
  const [pseudo, setPseudo] = useState(false);
  const [flash, setFlash] = useState("");

  // Build the player as soon as the page loads, so pressing play is instant.
  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("autoplay") === "1") { wantPlay.current = true; setBusy(true); }
  }, []);

  // After a video ends, count down and move to the next one.
  useEffect(() => {
    if (left === null) return;
    if (left <= 0) { if (next) router.push(`${next.href}?autoplay=1`); return; }
    const t = window.setTimeout(() => setLeft(left - 1), 1000);
    return () => window.clearTimeout(t);
  }, [left, next, router]);

  useEffect(() => {
    let dead = false;
    const h = host.current;
    loadApi().then(() => {
      if (dead || !h || !window.YT) return;
      const el = document.createElement("div");
      h.appendChild(el);
      player.current = new window.YT.Player(el, {
        videoId: id,
        playerVars: { controls: 0, rel: 0, modestbranding: 1, iv_load_policy: 3, disablekb: 1, fs: 0, playsinline: 1 },
        events: {
          onReady: () => { setReady(true); if (wantPlay.current) player.current?.playVideo(); },
          onStateChange: (e: { data: number }) => {
            setPlaying(e.data === 1);
            setBusy(e.data === 3);
            if (e.data === 0 && next) setLeft(5); else if (e.data === 1) setLeft(null);
            if (e.data === 1) { setStarted(true); wantPlay.current = false; }
          },
        },
      });
    });
    return () => { dead = true; try { player.current?.destroy(); } catch {} player.current = null; if (h) h.innerHTML = ""; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    const iv = window.setInterval(() => {
      const p = player.current;
      if (p && typeof p.getCurrentTime === "function") { setT(p.getCurrentTime()); setDur(p.getDuration()); }
    }, 500);
    return () => window.clearInterval(iv);
  }, []);

  function poke() {
    setUi(true);
    window.clearTimeout(hideTimer.current);
    hideTimer.current = window.setTimeout(() => setUi(false), 3000);
  }

  function toggle() {
    poke();
    const p = player.current;
    if (!p || !ready) { wantPlay.current = true; setBusy(true); return; }
    if (playing) p.pauseVideo(); else p.playVideo();
  }

  function skip(d: number) {
    poke();
    const p = player.current; if (!p || !ready) return;
    const to = Math.max(0, Math.min((dur || 1e9) - 1, p.getCurrentTime() + d));
    p.seekTo(to, true); setT(to);
    setFlash(d > 0 ? "+10s" : "−10s");
    window.setTimeout(() => setFlash(""), 600);
  }

  function tap(e: React.MouseEvent<HTMLButtonElement>) {
    const now = Date.now();
    const r = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    if (now - lastTap.current < 320 && started) {
      window.clearTimeout(tapTimer.current);
      lastTap.current = 0;
      if (x < 0.4) skip(-10); else if (x > 0.6) skip(10); else toggle();
      return;
    }
    lastTap.current = now;
    if (!started) { toggle(); return; }
    window.clearTimeout(tapTimer.current);
    tapTimer.current = window.setTimeout(() => { if (ui && playing) toggle(); else if (!playing) toggle(); else poke(); }, 260);
  }

  function fullscreen() {
    const w = wrap.current as FsEl | null; const d = document as FsDoc;
    if (!w) return;
    if (d.fullscreenElement || d.webkitFullscreenElement) { (d.exitFullscreen ?? d.webkitExitFullscreen)?.call(d); return; }
    if (pseudo) { setPseudo(false); return; }
    try {
      if (w.requestFullscreen) { void w.requestFullscreen().catch(() => setPseudo(true)); }
      else if (w.webkitRequestFullscreen) w.webkitRequestFullscreen();
      else setPseudo(true);
    } catch { setPseudo(true); }
  }

  const btn = "grid h-11 min-w-11 touch-manipulation place-items-center px-2 text-sm font-bold text-white";
  const showUi = ui || !playing;

  return (
    <div ref={wrap} onMouseMove={poke}
      className={`relative w-full select-none overflow-hidden bg-black [&_iframe]:h-full [&_iframe]:w-full ${pseudo ? "fixed inset-0 z-[100] h-[100dvh]" : "aspect-video"}`}>
      <div ref={host} className="absolute inset-0" />
      {/* Blocks clicks reaching the host player's own buttons and links; double tap left/right skips 10s */}
      <button type="button" aria-label={playing ? `Pause ${title}` : `Play ${title}`} onClick={tap} className="absolute inset-0 z-10 cursor-pointer touch-manipulation" />
      {!started && (
        <div className="pointer-events-none absolute inset-0 z-20 bg-black">
          <Image src={poster} alt={title} fill sizes="100vw" className="object-cover opacity-80" />
          <span className="absolute inset-0 grid place-items-center">
            <span className="grid h-20 w-20 place-items-center rounded-full bg-gold-bright text-ink shadow-xl">
              {busy ? <span className="h-8 w-8 animate-spin rounded-full border-4 border-ink/30 border-t-ink" /> :
                <svg viewBox="0 0 24 24" className="ml-1 h-8 w-8 fill-current" aria-hidden><path d="M8 5v14l11-7z" /></svg>}
            </span>
          </span>
        </div>
      )}
      {started && busy && <span className="pointer-events-none absolute left-1/2 top-1/2 z-20 h-12 w-12 -translate-x-1/2 -translate-y-1/2 animate-spin rounded-full border-4 border-white/30 border-t-white" />}
      {left !== null && next && (
        <div className="absolute inset-0 z-40 grid place-items-center bg-black/80 p-6 text-center text-white">
          <div>
            <p className="text-sm uppercase tracking-wider text-white/60">Up next in {Math.max(left, 0)}</p>
            <p className="mx-auto mt-2 max-w-md text-xl font-bold leading-snug">{next.title}</p>
            <div className="mt-5 flex justify-center gap-3">
              <button type="button" onClick={() => router.push(`${next.href}?autoplay=1`)} className="btn btn-gold">Play now</button>
              <button type="button" onClick={() => setLeft(null)} className="btn btn-ghost text-white">Cancel</button>
            </div>
          </div>
        </div>
      )}
      {flash && <span className="pointer-events-none absolute left-1/2 top-1/2 z-30 -translate-x-1/2 -translate-y-1/2 rounded-full bg-black/70 px-5 py-3 text-lg font-bold text-white">{flash}</span>}
      {started && !playing && !busy && (
        <span className="pointer-events-none absolute inset-0 z-20 grid place-items-center">
          <span className="grid h-16 w-16 place-items-center rounded-full bg-black/60 text-white"><svg viewBox="0 0 24 24" className="ml-1 h-7 w-7 fill-current" aria-hidden><path d="M8 5v14l11-7z" /></svg></span>
        </span>
      )}
      {started && (
        <div className={`absolute inset-x-0 bottom-0 z-30 bg-gradient-to-t from-black/85 to-transparent px-3 pb-2 pt-10 text-white transition-opacity duration-300 md:px-4 ${showUi ? "opacity-100" : "pointer-events-none opacity-0"}`}>
          <input type="range" min={0} max={dur || 1} step={1} value={Math.min(t, dur || 1)} aria-label="Seek"
            onChange={(e) => { const v = Number(e.target.value); setT(v); player.current?.seekTo(v, true); poke(); }}
            className="h-1.5 w-full cursor-pointer accent-[#e6c453]" />
          <div className="mt-1 flex items-center gap-1">
            <button type="button" onClick={toggle} aria-label={playing ? "Pause" : "Play"} className={btn}>{playing ? "❚❚" : "▶"}</button>
            <button type="button" onClick={() => skip(-10)} aria-label="Back 10 seconds" className={btn}>−10s</button>
            <button type="button" onClick={() => skip(10)} aria-label="Forward 10 seconds" className={btn}>+10s</button>
            <span className="ml-1 text-xs tabular-nums">{fmt(t)} / {fmt(dur)}</span>
            <span className="flex-1" />
            <button type="button" aria-label={muted ? "Unmute" : "Mute"} className={btn}
              onClick={() => { const p = player.current; if (!p) return; if (muted) p.unMute(); else p.mute(); setMuted(!muted); }}>
              {muted ? "Unmute" : "Mute"}
            </button>
            <button type="button" aria-label="Full screen" onClick={fullscreen} className={btn}>{pseudo ? "Exit" : "Full"}</button>
          </div>
        </div>
      )}
    </div>
  );
}
