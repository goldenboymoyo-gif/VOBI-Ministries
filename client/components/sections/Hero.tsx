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
  useEffect(() => { const t = window.setTimeout(() => setWait(true), 3000); return () => window.clearTimeout(t); }, []);
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
  }, [videoFile]);

  return (
    <section className="relative isolate overflow-hidden bg-ink text-white h-[84svh] min-h-[500px] max-h-[760px] md:h-[100svh] md:max-h-none md:min-h-[560px]">
      <div className="absolute inset-0 -z-10 overflow-hidden bg-ink">
        <Image src={image || "/photos/hero.jpg"} unoptimized={Boolean(image)} alt="Prophet Promise praying for a member of the congregation during a VOBI service"
          fill priority sizes="100vw" quality={82} className="object-cover object-center" />
        <video ref={vid} className={`absolute inset-0 h-full w-full transform-gpu object-cover object-center transition-opacity duration-1000 ${show ? "opacity-100" : "opacity-0"}`}
          src={videoFile} autoPlay muted loop playsInline preload="auto" onPlaying={() => setPlaying(true)} onError={() => { window.setTimeout(() => vid.current?.load(), 1500); }} disablePictureInPicture aria-hidden="true" />
        <div className="absolute inset-0 bg-ink/45" />
                <div className="absolute inset-0 [background:radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.45)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-[45%] bg-gradient-to-t from-ink/80 to-transparent" />
      </div>

      <div className="shell relative flex h-full items-center justify-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.9, ease }}
          className="mx-auto max-w-3xl px-2 [text-shadow:0_2px_18px_rgba(0,0,0,0.6)]"
        >
          <p className="text-lg font-light italic md:text-3xl">Welcome to</p>
          <h1 className="mt-2 text-[clamp(1.6rem,6.5vw,4rem)] font-extrabold uppercase leading-tight text-gold-bright">
            {site.fullName}
          </h1>
          <p className="mt-4 text-base font-semibold italic text-white md:mt-5 md:text-2xl">Because of Christ, we are saved.</p>
          <div className="mt-7 flex flex-wrap justify-center gap-3 md:mt-9">
            <Link href="/live" className="btn btn-gold">Watch Live</Link>
            <Link href="/visit" className="btn btn-ghost">Visit Us</Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
