"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

import { site } from "@/config/site";
import { thumb } from "@/lib/media";
import { Countdown } from "@/components/ui/Countdown";

const HERO_VIDEO = "zS8NL8NMNlQ";
const HERO_POSTER = thumb(HERO_VIDEO);

const ease = [0.16, 1, 0.3, 1] as const;

export function Hero() {
  const [showVideo, setShowVideo] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse = window.matchMedia("(max-width: 860px)").matches;
    const slow = (navigator as { connection?: { effectiveType?: string } }).connection
      ?.effectiveType;
    if (reduced || coarse || slow === "2g" || slow === "slow-2g") return;

    const id = window.setTimeout(() => setShowVideo(true), 1600);
    return () => window.clearTimeout(id);
  }, []);

  return (
    <section className="relative isolate min-h-[86svh] overflow-hidden bg-ink text-paper">
      {/* Background: real VOBI service footage, poster underneath */}
      <div className="absolute inset-0 -z-10">
        <Image
          src={HERO_POSTER}
          alt="VOBI Sunday service in Victoria Falls, Zimbabwe"
          fill
          priority
          sizes="100vw"
          quality={82}
          className="object-cover object-center"
        />
        {showVideo && (
          <iframe
            className="absolute inset-0 h-full w-full scale-[1.06] border-0"
            src={`https://www.youtube.com/embed/${HERO_VIDEO}?autoplay=1&mute=1&loop=1&playlist=${HERO_VIDEO}&controls=0&modestbranding=1&playsinline=1&rel=0&disablekb=1&iv_load_policy=3&fs=0`}
            title="VOBI service footage"
            allow="autoplay; encrypted-media"
            tabIndex={-1}
            aria-hidden="true"
          />
        )}
        {/* Dark natural overlay so the text stays calm and readable */}
        <div className="absolute inset-0 bg-ink/45" />
        <div className="absolute inset-x-0 bottom-0 h-[60%] bg-gradient-to-t from-ink via-ink/60 to-transparent" />
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-ink/70 to-transparent" />
      </div>

      <div className="shell flex min-h-[86svh] flex-col justify-end pb-14 pt-32 md:pb-20 md:pt-40">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25, duration: 0.8, ease }}
          className="text-lg font-light uppercase tracking-[0.3em] text-gold-bright"
        >
          Welcome to
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 1, ease }}
          className="display-lg mt-4 max-w-[18ch]"
        >
          {site.fullName}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.9, ease }}
          className="mt-5 max-w-xl text-lg text-paper/90"
        >
          {site.statements.distance} Join us every Sunday from Victoria Falls, live to the world.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.9, ease }}
          className="mt-9"
        >
          <Countdown />
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:gap-4">
            <Link href="/live" className="btn btn-gold justify-center">Watch Live</Link>
            <Link href="/sermons" className="btn btn-ghost justify-center">VOBI TV</Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
