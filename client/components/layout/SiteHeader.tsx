"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { nav, navActions } from "@/config/site";
import { socialLinks } from "@/config/socialLinks";
import { Logo } from "@/components/ui/Logo";
import { SocialLinks } from "@/components/ui/SocialLinks";

export function SiteHeader() {
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);

  const closeMenu = () => setOpen(false);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 64);
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

  const isDark = !solid;

  return (
    <>
      <header
        className={[
          "fixed inset-x-0 top-0 z-50 transition-[background-color,color,border-color,box-shadow] duration-500",
          solid
            ? "border-b border-line bg-paper/95 text-ink backdrop-blur-md"
            : "border-b border-transparent text-paper",
        ].join(" ")}
      >
        {!solid && (
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 z-[-1] h-full bg-[#a38845] shadow-md"
          />
        )}
        <div className="shell flex h-[72px] items-center justify-between gap-5 md:h-[80px]">
          <Link href="/" className="shrink-0" aria-label="VOBI — home">
            <Logo tone={isDark ? "reverse" : "solid"} variant="mark" />
          </Link>

          <nav className="hidden items-center gap-7 xl:flex" aria-label="Primary">
            {nav.map((item) =>
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
            className="fixed inset-0 z-40 flex flex-col justify-between bg-ink px-6 pb-10 pt-[104px] text-paper xl:hidden"
            initial={{ opacity: 0, y: -14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }}
            transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
          >
            <nav aria-label="Mobile" className="flex flex-col">
              {nav.map((item, i) => (
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
