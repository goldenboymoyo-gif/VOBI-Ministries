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
    if (reduced) return;
    // Let the page finish loading first (keeps the photo/text paint fast), then start the video; the photo shows until the first frame plays.
    let id = 0;
    const start = () => { id = window.setTimeout(() => setShowVideo(true), 400); };
    if (document.readyState === "complete") start(); else window.addEventListener("load", start, { once: true });
    return () => { window.clearTimeout(id); window.removeEventListener("load", start); };
  }, []);

  // Browsers sometimes pause autoplay (tab in background, power saving, slow start). Keep nudging it to play.
  useEffect(() => {
    const v = vid.current;
    if (!showVideo || !v) return;
    v.muted = true; v.defaultMuted = true; v.setAttribute("muted", ""); v.setAttribute("playsinline", "");
    const go = () => { if (v.paused) v.play().catch(() => {}); };
    // Phones in power-saving mode only allow autoplay after a touch: retry on the first interaction.
    const kick = () => go();
    (['touchstart', 'pointerdown', 'scroll', 'click', 'keydown'] as const).forEach((e) => window.addEventListener(e, kick, { once: true, passive: true }));
    go();
    const iv = window.setInterval(go, 2000);
    const vis = () => { if (document.visibilityState === "visible") go(); };
    document.addEventListener("visibilitychange", vis);
    v.addEventListener("loadeddata", go); v.addEventListener("canplay", go); v.addEventListener("stalled", go); v.addEventListener("pause", go);
    return () => {
      (['touchstart', 'pointerdown', 'scroll', 'click', 'keydown'] as const).forEach((e) => window.removeEventListener(e, kick));
      window.clearInterval(iv); document.removeEventListener("visibilitychange", vis);
      v.removeEventListener("loadeddata", go); v.removeEventListener("canplay", go); v.removeEventListener("stalled", go); v.removeEventListener("pause", go);
    };
  }, [showVideo, videoFile]);

  return (
    <section className="relative isolate overflow-hidden bg-ink text-white h-[84svh] min-h-[500px] max-h-[760px] md:h-[100svh] md:max-h-none md:min-h-[560px]">
      {/* Phones: the video sits in a normal 16:9 frame (no zoom), with the welcome card below. From tablet up it fills the hero. */}
      <div className="absolute inset-0 -z-10 overflow-hidden [container-type:size]">
        <Image src={image || "/photos/hero.jpg"} unoptimized={Boolean(image)} alt="Prophet Promise praying for a member of the congregation during a VOBI service"
          fill priority sizes="100vw" quality={82} className={`${ready ? "" : "kenburns"} object-cover object-center`} />
        {showVideo && videoFile && (
          <video ref={vid} className={`absolute inset-0 h-full w-full transform-gpu object-cover object-center transition-opacity duration-700 ${ready ? "opacity-100" : "opacity-0"}`}
            src={videoFile} autoPlay muted loop playsInline preload="auto" poster={image || "/photos/hero.jpg"} onError={() => { window.setTimeout(() => vid.current?.load(), 1500); }} disablePictureInPicture aria-hidden="true" onPlaying={() => setReady(true)} />
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

      <div className="shell relative flex h-full items-end pb-8 md:pb-24">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.9, ease }}
          className="max-w-[19rem] rounded-2xl bg-ink/55 p-4 backdrop-blur-sm sm:max-w-sm md:max-w-xl md:bg-ink/65 md:p-8"
        >
          <p className="text-base font-light italic md:text-2xl">Welcome to</p>
          <h1 className="mt-2 text-[clamp(1.05rem,4.6vw,2.5rem)] font-extrabold uppercase leading-tight text-gold-bright">
            {site.fullName}
          </h1>
          <p className="mt-3 border-l-4 border-gold-bright pl-3 text-sm font-semibold italic text-white md:mt-4 md:pl-4 md:text-xl">Because of Christ, we are saved.</p>
          <div className="mt-5 flex flex-wrap gap-3 md:mt-6">
            <Link href="/live" className="btn btn-gold">Watch Live</Link>
            <Link href="/visit" className="btn btn-ghost">Visit Us</Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
