"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

import { site } from "@/config/site";
import { thumb } from "@/lib/media";

const HERO_VIDEO = "zS8NL8NMNlQ";
const HERO_POSTER = thumb(HERO_VIDEO);

const PILLARS = ["Word", "Prayer", "Worship", "Testimony"];

const ease = [0.16, 1, 0.3, 1] as const;

export function Hero({ latestDate }: { latestDate: string }) {
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
    <section className="relative isolate min-h-[100svh] overflow-hidden bg-ink text-paper">
      {/* Background: real VOBI service footage, poster underneath */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0" data-parallax="6">
          <Image
            src={HERO_POSTER}
            alt="VOBI Sunday service in Victoria Falls, Zimbabwe"
            fill
            priority
            sizes="100vw"
            quality={82}
            className="object-cover object-center"
          />
        </div>
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
        <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_75%_15%,rgba(16,20,19,0.15),rgba(16,20,19,0.85))]" />
        <div className="absolute inset-x-0 bottom-0 h-[72%] bg-gradient-to-t from-ink via-ink/85 to-transparent" />
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-ink/85 to-transparent" />
      </div>

      <div className="shell flex min-h-[100svh] flex-col justify-end pb-16 pt-32 md:pb-20 md:pt-40">
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.8, ease }}
          className="eyebrow text-paper/60"
        >
          {site.city} · {site.country}
        </motion.p>

        <div className="mt-5 max-w-[16ch] overflow-hidden">
          <motion.h1
            initial={{ y: "108%" }}
            animate={{ y: 0 }}
            transition={{ delay: 0.35, duration: 1.15, ease }}
            className="display-xl"
          >
            Because of Christ
            <br />
            we are saved.
          </motion.h1>
        </div>

        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.9, ease }}
          className="mt-7 max-w-xl text-[15px] leading-relaxed text-paper/70 md:text-base"
        >
          {site.statements.welcome}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.85, duration: 0.9, ease }}
          className="mt-10 flex flex-col gap-7 border-t border-line-dark pt-7 sm:flex-row sm:items-center sm:justify-between"
        >
          <ul className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-paper/55 sm:gap-x-7">
            {PILLARS.map((p) => (
              <li key={p} className="flex items-center gap-5 sm:gap-7">
                {p}
                <span aria-hidden className="hidden h-px w-6 bg-paper/25 sm:block" />
              </li>
            ))}
          </ul>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link href="/live" className="btn btn-solid">
              Watch Live
            </Link>
            <Link href="/visit" className="btn btn-ghost">
              Plan Your Visit
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.15, duration: 0.8 }}
          className="mt-7 flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] uppercase tracking-[0.18em] text-paper/45"
        >
          <span className="inline-flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-gold-bright" aria-hidden />
            Latest broadcast
          </span>
          <span aria-hidden>·</span>
          <span>{latestDate}</span>
          <span aria-hidden>·</span>
          <span>{site.statements.distance}</span>
        </motion.div>
      </div>
    </section>
  );
}
