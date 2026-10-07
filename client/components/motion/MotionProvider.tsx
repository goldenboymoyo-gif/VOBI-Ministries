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
        // Headline / block reveals
        gsap.utils.toArray<HTMLElement>(".reveal").forEach((el) => {
          gsap.to(el, {
            opacity: 1,
            y: 0,
            duration: 1.05,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 88%", once: true },
          });
        });

        // Image clip reveals
        gsap.utils.toArray<HTMLElement>(".reveal-clip").forEach((el) => {
          gsap.to(el, {
            clipPath: "inset(0% 0% 0% 0%)",
            duration: 1.35,
            ease: "power4.out",
            scrollTrigger: { trigger: el, start: "top 85%", once: true },
          });
        });

        // Slow parallax on framed imagery
        gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((el) => {
          const amount = Number(el.dataset.parallax) || 8;
          gsap.fromTo(
            el,
            { yPercent: -amount },
            {
              yPercent: amount,
              ease: "none",
              scrollTrigger: {
                trigger: el.parentElement ?? el,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
              },
            },
          );
        });

        // Oversized numerals drift
        gsap.utils.toArray<HTMLElement>("[data-drift]").forEach((el) => {
          gsap.fromTo(
            el,
            { xPercent: Number(el.dataset.drift) || -6 },
            {
              xPercent: 0,
              ease: "none",
              scrollTrigger: {
                trigger: el,
                start: "top bottom",
                end: "bottom top",
                scrub: 1,
              },
            },
          );
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
