"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

import { site } from "@/config/site";

const HERO_VIDEO = "d5NuEDZKcZg"; // "Highlight | Power in Presence", a short highlight, not a full service
const ease = [0.16, 1, 0.3, 1] as const;

export function Hero({ video = HERO_VIDEO, image, videoFile }: { video?: string; image?: string; videoFile?: string }) {
  const [showVideo, setShowVideo] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const conn = (navigator as { connection?: { effectiveType?: string; saveData?: boolean } }).connection;
    if (reduced || conn?.saveData || conn?.effectiveType === "2g" || conn?.effectiveType === "slow-2g") return;
    const id = window.setTimeout(() => setShowVideo(true), 1200);
    return () => window.clearTimeout(id);
  }, []);

  return (
    <section className="relative isolate h-[80svh] min-h-[480px] max-h-[760px] overflow-hidden bg-ink text-white md:h-[100svh] md:min-h-[560px] md:max-h-none">
      <div className="absolute inset-0 -z-10">
        <Image src={image || "/photos/hero.jpg"} unoptimized={Boolean(image)} alt="Prophet Promise praying for a member of the congregation during a VOBI service"
          fill priority sizes="100vw" quality={82} className={`${ready ? "" : "kenburns"} object-cover object-center`} />
        {showVideo && videoFile && (
          <video className={`absolute inset-0 h-full w-full transform-gpu object-cover transition-opacity duration-700 ${ready ? "opacity-100" : "opacity-0"}`}
            src={videoFile} autoPlay muted loop playsInline preload="auto" disablePictureInPicture aria-hidden="true" onCanPlayThrough={() => setReady(true)} />
        )}
        {showVideo && !videoFile && (
          <iframe
            className="absolute left-1/2 top-1/2 border-0"
            style={{ width: "max(100vw, 177.78svh)", height: "max(56.25vw, 100svh)", transform: "translate(-50%, -50%)" }}
            src={`https://www.youtube-nocookie.com/embed/${video}?autoplay=1&mute=1&loop=1&playlist=${video}&controls=0&modestbranding=1&playsinline=1&rel=0&disablekb=1&iv_load_policy=3&fs=0&vq=hd1080`}
            title="VOBI service footage" allow="autoplay; encrypted-media" tabIndex={-1} aria-hidden="true"
          />
        )}
        <div className="absolute inset-0 bg-ink/45" />
                <div className="absolute inset-0 [background:radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.45)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-[45%] bg-gradient-to-t from-ink/80 to-transparent" />
      </div>

      <div className="shell flex h-full items-end pb-8 md:pb-24">
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
