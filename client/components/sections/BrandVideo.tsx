"use client";

import { useEffect, useRef } from "react";

export function BrandVideo() {
  const ref = useRef<HTMLVideoElement>(null);

  // Play the logo reveal each time it scrolls into view.
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          v.currentTime = 0;
          v.play().catch(() => {});
        }
      },
      { threshold: 0.5 },
    );
    io.observe(v);
    return () => io.disconnect();
  }, []);

  return (
    <section className="bg-[#f1f1ef]">
      <video
        ref={ref}
        className="mx-auto block w-full max-w-[1280px]"
        src="/brand/logo-intro.mp4"
        poster="/brand/logo-intro-poster.jpg"
        muted
        playsInline
        preload="metadata"
        aria-label="VOBI Ministries logo animation"
      />
    </section>
  );
}
