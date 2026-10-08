"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

import { site } from "@/config/site";

const HERO_VIDEO = "zS8NL8NMNlQ";
const ease = [0.16, 1, 0.3, 1] as const;

export function Hero() {
  const [showVideo, setShowVideo] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const small = window.matchMedia("(max-width: 860px)").matches;
    const slow = (navigator as { connection?: { effectiveType?: string } }).connection?.effectiveType;
    if (reduced || small || slow === "2g" || slow === "slow-2g") return;
    const id = window.setTimeout(() => setShowVideo(true), 1200);
    return () => window.clearTimeout(id);
  }, []);

  return (
    <section className="relative isolate h-[100svh] min-h-[560px] overflow-hidden bg-ink text-white">
      <div className="absolute inset-0 -z-10">
        <Image src="/photos/hero.jpg" alt="Prophet Promise praying for a member of the congregation during a VOBI service"
          fill priority sizes="100vw" quality={82} className="kenburns object-cover object-center" />
        {showVideo && (
          <iframe
            className="absolute left-1/2 top-1/2 border-0"
            style={{ width: "max(100vw, 177.78svh)", height: "max(56.25vw, 100svh)", transform: "translate(-50%, -50%)" }}
            src={`https://www.youtube.com/embed/${HERO_VIDEO}?autoplay=1&mute=1&loop=1&playlist=${HERO_VIDEO}&controls=0&modestbranding=1&playsinline=1&rel=0&disablekb=1&iv_load_policy=3&fs=0`}
            title="VOBI service footage" allow="autoplay; encrypted-media" tabIndex={-1} aria-hidden="true"
          />
        )}
        <div className="absolute inset-0 bg-ink/20" />
        <div className="absolute inset-x-0 bottom-0 h-[45%] bg-gradient-to-t from-ink/80 to-transparent" />
      </div>

      <div className="shell flex h-full items-end pb-16 md:pb-24">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.9, ease }}
          className="max-w-xl bg-ink/55 p-6 backdrop-blur-sm md:p-8"
        >
          <p className="text-2xl font-light italic">Welcome to</p>
          <h1 className="mt-2 text-[clamp(1.5rem,3.2vw,2.5rem)] font-extrabold uppercase leading-tight text-gold-bright">
            {site.fullName}
          </h1>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/live" className="btn btn-gold">Watch Live</Link>
            <Link href="/visit" className="btn btn-ghost">Visit Us</Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
