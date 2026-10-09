"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { nav, navActions } from "@/config/site";
import { socialLinks } from "@/config/socialLinks";
import { Logo } from "@/components/ui/Logo";
import { SocialLinks } from "@/components/ui/SocialLinks";

export function SiteHeader({ menu }: { menu?: { label: string; href: string; children?: { label: string; href: string }[] }[] }) {
  const items = menu ?? nav;
  const [solid, setSolid] = useState(false);
  const [tone, setTone] = useState<{ bg: string; fg: string; dark: boolean } | null>(null);
  const [open, setOpen] = useState(false);

  const closeMenu = () => setOpen(false);

  useEffect(() => {
    const rgba = (c: string) => {
      const cv = document.createElement("canvas"); cv.width = cv.height = 1;
      const cx = cv.getContext("2d", { willReadFrequently: true }); if (!cx) return null;
      cx.clearRect(0, 0, 1, 1); cx.fillStyle = c; cx.fillRect(0, 0, 1, 1);
      const d = cx.getImageData(0, 0, 1, 1).data; return [d[0], d[1], d[2], d[3] / 255];
    };
    const onScroll = () => {
      setSolid(window.scrollY > 24);
      if (window.scrollY <= 24) return;
      const hdr = document.querySelector("[data-site-header]");
      for (const el of document.elementsFromPoint(window.innerWidth / 2, 110)) {
        if (hdr && hdr.contains(el)) continue;
        for (let n: Element | null = el; n; n = n.parentElement) {
          const p = rgba(getComputedStyle(n).backgroundColor);
          if (p && p[3] > 0.9) {
            const lum = (0.299 * p[0] + 0.587 * p[1] + 0.114 * p[2]) / 255;
            setTone({ bg: `rgb(${p[0]},${p[1]},${p[2]})`, fg: lum < 0.55 ? "#ffffff" : "#101413", dark: lum < 0.55 });
            return;
          }
        }
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const isDark = !solid || (tone?.dark ?? false);

  return (
    <>
      <header
        data-site-header
        style={solid && tone ? { backgroundColor: tone.bg, color: tone.fg } : undefined}
        className={[
          "fixed inset-x-0 top-0 z-50 transition-[background-color,color,box-shadow] duration-300",
          solid ? "shadow-sm" : "text-white",
        ].join(" ")}
      >
        {!solid && (
          <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 z-[-1] h-[140%] bg-gradient-to-b from-black/55 to-transparent" />
        )}
        <div className="shell mt-3 flex h-[84px] md:mt-5 items-center justify-between gap-5 md:h-[100px]">
          <Link href="/" className="shrink-0" aria-label="VOBI, home">
            <Logo tone={isDark ? "reverse" : "solid"} variant="mark" />
          </Link>

          <nav className="hidden items-center gap-7 xl:flex" aria-label="Primary">
            {items.map((item) =>
              item.children ? (
                <div key={item.href} className="group relative">
                  <Link
                    href={item.href}
                    className="link-underline py-6 text-[13.5px] font-medium"
                  >
                    {item.label}
                  </Link>
                  <div className="pointer-events-none absolute left-0 top-full w-56 border border-line bg-paper text-ink opacity-0 shadow-[0_18px_50px_-24px_rgba(16,20,19,0.5)] transition-all duration-300 group-hover:pointer-events-auto group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:opacity-100">
                    <ul className="py-2">
                      {item.children.map((c) => (
                        <li key={c.href}>
                          <Link
                            href={c.href}
                            className="block px-5 py-2.5 text-[13.5px] transition-colors hover:bg-paper-dim"
                          >
                            {c.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  className="link-underline py-6 text-[13.5px] font-medium"
                >
                  {item.label}
                </Link>
              ),
            )}
          </nav>

          <div className="hidden items-center gap-3 xl:flex">
            {navActions.map((a) => (
              <Link
                key={a.href}
                href={a.href}
                className={
                  a.variant === "solid"
                    ? solid
                      ? "btn btn-ink"
                      : "btn btn-solid"
                    : "btn btn-ghost"
                }
              >
                {a.label}
              </Link>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="flex items-center gap-3 text-[13.5px] font-medium xl:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
          >
            {open ? "Close" : "Menu"}
            <span className="flex h-3 w-6 flex-col justify-between">
              <span
                className={`h-px w-full bg-current transition-transform duration-300 ${open ? "translate-y-[5.5px] rotate-45" : ""}`}
              />
              <span className={`h-px w-full bg-current transition-opacity duration-200 ${open ? "opacity-0" : ""}`} />
              <span
                className={`h-px w-full bg-current transition-transform duration-300 ${open ? "-translate-y-[5.5px] -rotate-45" : ""}`}
              />
            </span>
          </button>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            className="fixed inset-0 z-40 flex flex-col justify-between bg-ink px-6 pb-10 pt-[124px] text-paper xl:hidden"
            initial={{ opacity: 0, y: -14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }}
            transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
          >
            <nav aria-label="Mobile" className="flex flex-col">
              {items.map((item, i) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: 0.07 + i * 0.045,
                    duration: 0.5,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="border-b border-line-dark"
                >
                  <Link
                    href={item.href}
                    onClick={closeMenu}
                    className="flex items-baseline justify-between py-4 text-[1.1rem] font-medium"
                  >
                    {item.label}
                  </Link>
                  {item.children && (
                    <ul className="flex flex-wrap gap-x-5 gap-y-2 pb-4">
                      {item.children.map((c) => (
                        <li key={c.href}>
                          <Link
                            href={c.href}
                            onClick={closeMenu}
                            className="text-[13.5px] opacity-70"
                          >
                            {c.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </motion.div>
              ))}
            </nav>

            <div className="space-y-6">
              <div className="flex flex-col gap-3">
                {navActions.map((a) => (
                  <Link
                    key={a.href}
                    href={a.href}
                    onClick={closeMenu}
                    className={a.variant === "solid" ? "btn btn-solid justify-center" : "btn btn-ghost justify-center"}
                  >
                    {a.label}
                  </Link>
                ))}
              </div>
              <div className="rule-dark" />
              <SocialLinks links={socialLinks} tone="reverse" showLabel />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
