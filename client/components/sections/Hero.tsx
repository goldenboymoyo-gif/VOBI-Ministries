"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

import { site } from "@/config/site";

const HERO_VIDEO = "d5NuEDZKcZg"; // "Highlight | Power in Presence", a short highlight, not a full service
const ease = [0.16, 1, 0.3, 1] as const;

export function Hero({ video = HERO_VIDEO, image, videoFile }: { video?: string; image?: string; videoFile?: string }) {
  const [showVideo, setShowVideo] = useState(false);
  const [ready, setReady] = useState(false);
  const vid = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const conn = (navigator as { connection?: { effectiveType?: string; saveData?: boolean; downlink?: number } }).connection;
    // Only start the (large) video on a reasonably fast connection. Slow or data-saving visitors keep the light photo.
    const fast = !conn || (conn.effectiveType === undefined || conn.effectiveType === "4g") && (conn.downlink === undefined || conn.downlink >= 2);
    if (reduced || conn?.saveData || !fast) return;
    let id = 0;
    const start = () => { id = window.setTimeout(() => setShowVideo(true), 300); };
    // Let the page and photo finish loading first, so the video never competes with them.
    if (document.readyState === "complete") start(); else window.addEventListener("load", start, { once: true });
    return () => { window.clearTimeout(id); window.removeEventListener("load", start); };
  }, []);

  // Browsers sometimes pause autoplay (tab in background, power saving, slow start). Keep nudging it to play.
  useEffect(() => {
    const v = vid.current;
    if (!showVideo || !v) return;
    v.muted = true;
    const go = () => { if (v.paused) v.play().catch(() => {}); };
    go();
    const iv = window.setInterval(go, 2000);
    const vis = () => { if (document.visibilityState === "visible") go(); };
    document.addEventListener("visibilitychange", vis);
    v.addEventListener("loadeddata", go); v.addEventListener("canplay", go); v.addEventListener("stalled", go); v.addEventListener("pause", go);
    return () => {
      window.clearInterval(iv); document.removeEventListener("visibilitychange", vis);
      v.removeEventListener("loadeddata", go); v.removeEventListener("canplay", go); v.removeEventListener("stalled", go); v.removeEventListener("pause", go);
    };
  }, [showVideo, videoFile]);

  return (
    <section className="relative isolate overflow-hidden bg-ink text-white md:h-[100svh] md:min-h-[560px]">
      {/* Phones: the video sits in a normal 16:9 frame (no zoom), with the welcome card below. From tablet up it fills the hero. */}
      <div className="relative aspect-video w-full overflow-hidden [container-type:size] md:absolute md:inset-0 md:-z-10 md:aspect-auto">
        <Image src={image || "/photos/hero.jpg"} unoptimized={Boolean(image)} alt="Prophet Promise praying for a member of the congregation during a VOBI service"
          fill priority sizes="100vw" quality={82} className={`${ready ? "" : "kenburns"} object-cover object-center`} />
        {showVideo && videoFile && (
          <video ref={vid} className={`absolute inset-0 h-full w-full transform-gpu object-cover object-center transition-opacity duration-700 ${ready ? "opacity-100" : "opacity-0"}`}
            src={videoFile} autoPlay muted loop playsInline preload="auto" disablePictureInPicture aria-hidden="true" onPlaying={() => setReady(true)} />
        )}
        {showVideo && !videoFile && (
          <iframe
            className="absolute left-1/2 top-1/2 border-0"
            style={{ width: "max(100cqw, 177.78cqh)", height: "max(56.25cqw, 100cqh)", transform: "translate(-50%, -50%)" }}
            src={`https://www.youtube-nocookie.com/embed/${video}?autoplay=1&mute=1&loop=1&playlist=${video}&controls=0&modestbranding=1&playsinline=1&rel=0&disablekb=1&iv_load_policy=3&fs=0&vq=hd1080`}
            title="VOBI service footage" allow="autoplay; encrypted-media" tabIndex={-1} aria-hidden="true"
          />
        )}
        <div className="absolute inset-0 bg-ink/45" />
                <div className="absolute inset-0 [background:radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.45)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-[45%] bg-gradient-to-t from-ink/80 to-transparent" />
      </div>

      <div className="shell relative py-6 md:flex md:h-full md:items-end md:pb-24 md:pt-0">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.9, ease }}
          className="max-w-xl rounded-2xl bg-ink/65 p-5 md:p-8"
        >
          <p className="text-2xl font-light italic">Welcome to</p>
          <h1 className="mt-2 text-[clamp(1.5rem,3.2vw,2.5rem)] font-extrabold uppercase leading-tight text-gold-bright">
            {site.fullName}
          </h1>
          <p className="mt-4 border-l-4 border-gold-bright pl-4 text-lg font-semibold italic text-white md:text-xl">Because of Christ, we are saved.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/live" className="btn btn-gold">Watch Live</Link>
            <Link href="/visit" className="btn btn-ghost">Visit Us</Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
