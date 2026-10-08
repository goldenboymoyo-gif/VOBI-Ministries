"use client";

import { useEffect, type ReactNode } from "react";

/**
 * Motion system.
 *
 * GSAP ScrollTrigger drives the editorial scroll choreography; Lenis provides
 * the smooth scroll. Framer Motion handles component-level UI transitions.
 * Everything is disabled under prefers-reduced-motion.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    let cleaned = false;
    let dispose: (() => void) | undefined;

    const boot = async () => {
      const gsap = (await import("gsap")).default;
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      const Lenis = (await import("lenis")).default;
      if (cleaned) return;

      gsap.registerPlugin(ScrollTrigger);

      const lenis = new Lenis({
        duration: 1.05,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        touchMultiplier: 1.4,
      });

      lenis.on("scroll", ScrollTrigger.update);
      const tick = (time: number) => lenis.raf(time * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);

      const ctx = gsap.context(() => {
        // Block reveals
        gsap.utils.toArray<HTMLElement>(".reveal").forEach((el) => {
          gsap.to(el, {
            opacity: 1,
            y: 0,
            duration: 1.05,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 88%", once: true },
          });
        });
      });

      // Elements that were already in view when JS took over
      ScrollTrigger.refresh();

      dispose = () => {
        ctx.revert();
        gsap.ticker.remove(tick);
        lenis.destroy();
        ScrollTrigger.getAll().forEach((t) => t.kill());
      };
    };

    boot();

    return () => {
      cleaned = true;
      dispose?.();
    };
  }, []);

  return <>{children}</>;
}
