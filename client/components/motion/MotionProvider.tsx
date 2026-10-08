"use client";

import { useEffect, type ReactNode } from "react";
import { usePathname } from "next/navigation";

/** Fades sections in as they scroll into view. Content is visible by default if scripts fail. */
export function MotionProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    document.documentElement.classList.add("js");
    const els = Array.from(document.querySelectorAll<HTMLElement>(".reveal:not(.in)"));
    if (!("IntersectionObserver" in window)) { els.forEach((e) => e.classList.add("in")); return; }
    const io = new IntersectionObserver(
      (entries) => entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } }),
      { rootMargin: "0px 0px -8% 0px", threshold: 0.05 },
    );
    els.forEach((e) => io.observe(e));
    const failsafe = window.setTimeout(() => els.forEach((e) => e.classList.add("in")), 4000);
    return () => { io.disconnect(); window.clearTimeout(failsafe); };
  }, [pathname]);

  return <>{children}</>;
}
