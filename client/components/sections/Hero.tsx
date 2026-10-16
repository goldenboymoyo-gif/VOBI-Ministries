"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

import { site } from "@/config/site";

const ease = [0.16, 1, 0.3, 1] as const;

export function Hero({ image, videoFile: adminFile }: { video?: string; image?: string; videoFile?: string }) {
  const videoFile = adminFile || "/hero.mp4";
  const vid = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [wait, setWait] = useState(false);
  const [slow, setSlow] = useState(false);
  useEffect(() => { const c = (navigator as unknown as { connection?: { saveData?: boolean; effectiveType?: string } }).connection; if (c && (c.saveData || /(^|-)2g$/.test(c.effectiveType || ""))) setSlow(true); const t = window.setTimeout(() => setWait(true), 3000); return () => window.clearTimeout(t); }, []);
  const show = playing && wait;

  // Browsers sometimes pause autoplay (power saving, slow start). Keep nudging it to play.
  useEffect(() => {
    const v = vid.current;
    if (!v) return;
    v.muted = true; v.defaultMuted = true; v.setAttribute("muted", ""); v.setAttribute("playsinline", "");
    const go = () => { if (v.paused) v.play().catch(() => {}); };
    const kick = () => go();
    (["touchstart", "pointerdown", "scroll", "click", "keydown"] as const).forEach((e) => window.addEventListener(e, kick, { once: true, passive: true }));
    go();
    const iv = window.setInterval(go, 2000);
    v.addEventListener("loadeddata", go); v.addEventListener("canplay", go); v.addEventListener("pause", go);
    return () => {
      (["touchstart", "pointerdown", "scroll", "click", "keydown"] as const).forEach((e) => window.removeEventListener(e, kick));
      window.clearInterval(iv);
      v.removeEventListener("loadeddata", go); v.removeEventListener("canplay", go); v.removeEventListener("pause", go);
    };
  }, [videoFile, wait, slow]);

  return (
    <section className="relative isolate overflow-hidden bg-ink text-white">
      <div className="absolute inset-0 -z-10 overflow-hidden bg-ink">
        <Image src={image || "/photos/hero.jpg"} unoptimized={Boolean(image)} alt="Prophet Promise praying for a member of the congregation during a VOBI service"
          fill priority sizes="100vw" quality={82} className="object-cover object-center" />
        {!slow && <video ref={vid} className={`absolute inset-0 h-full w-full transform-gpu object-cover object-center transition-opacity duration-1000 ${show ? "opacity-100" : "opacity-0"}`}
          src={videoFile} autoPlay muted loop playsInline preload="auto" onPlaying={() => setPlaying(true)} onError={() => { window.setTimeout(() => vid.current?.load(), 1500); }} disablePictureInPicture aria-hidden="true" />}
        <div className="absolute inset-0 bg-ink/45" />
                <div className="absolute inset-0 [background:radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.45)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-[45%] bg-gradient-to-t from-ink/80 to-transparent" />
      </div>

      <div className="shell relative flex min-h-[84svh] items-end pb-12 pt-32 md:min-h-[100svh] md:pb-20 md:pt-40">
        <div className="max-w-[94vw] md:max-w-4xl">
          <motion.p
            initial={{ opacity: 0, x: -90 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2, duration: 1, ease }}
            className="inline-block bg-ink/55 px-3 py-1 text-[clamp(1.3rem,min(5vw,6vh),3.2rem)] font-light italic leading-tight text-white"
          >Welcome To</motion.p>
          <motion.h1
            initial={{ opacity: 0, x: -140 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.55, duration: 1.1, ease }}
            className="mt-1 text-[clamp(1.5rem,min(5.4vw,8vh),4.2rem)] font-extrabold uppercase leading-[1.3] text-gold-bright"
          >
            <span className="box-decoration-clone bg-ink/55 px-3 py-1">{site.fullName}</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, x: -90 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1, duration: 1, ease }}
            className="mt-3 inline-block bg-ink/55 px-3 py-1 text-sm font-semibold italic text-white md:text-xl"
          >Because of Christ, we are saved.</motion.p>
          <motion.div
            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.4, duration: 0.9, ease }}
            className="mt-6 flex flex-wrap gap-3"
          >
            <Link href="/live" className="btn btn-gold">Watch Live</Link>
            <Link href="/visit" className="btn btn-ghost">Visit Us</Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}