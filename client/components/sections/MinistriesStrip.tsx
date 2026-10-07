"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

import type { Ministry } from "@/types";
import { SectionHead } from "@/components/ui/SectionHead";

export function MinistriesStrip({ ministries }: { ministries: Ministry[] }) {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <section className="border-b border-line bg-paper py-20 md:py-28">
      <div className="shell">
        <SectionHead
          index="05"
          eyebrow="Ministries"
          title={
            <>
              Four works,
              <br />
              all evidenced.
            </>
          }
          aside={
            <p className="max-w-md text-[15px] leading-relaxed text-muted">
              These are the ministries VOBI documents in its own uploads. Departments we could not
              confirm are not listed — we would rather leave a space empty than fill it with a
              guess.
            </p>
          }
        />

        <ul className="mt-14 border-t border-line">
          {ministries.map((m, i) => (
            <li key={m.id}>
              <Link
                href={`/ministries/${m.slug}`}
                className="group relative flex items-start gap-6 border-b border-line py-8 md:gap-10 md:py-10"
                onMouseEnter={() => setHovered(m.id)}
                onMouseLeave={() => setHovered(null)}
              >
                <span className="numeral mt-2 shrink-0 text-[11px] tracking-[0.2em] text-muted-light">
                  0{i + 1}
                </span>

                <span className="min-w-0 flex-1">
                  <span className="display-sm block transition-transform duration-500 group-hover:translate-x-1.5">
                    {m.name}
                  </span>
                  <span className="mt-3 block max-w-2xl text-[14px] leading-relaxed text-muted">
                    {m.summary}
                  </span>
                </span>

                <span className="hidden w-40 shrink-0 self-center overflow-hidden md:block">
                  <span
                    className={`block aspect-video overflow-hidden bg-paper-deep transition-all duration-700 ${
                      hovered === m.id ? "opacity-100" : "opacity-0"
                    }`}
                  >
                    <Image
                      src={m.image}
                      alt=""
                      width={320}
                      height={180}
                      sizes="160px"
                      className={`h-full w-full object-cover transition-transform duration-[1.2s] ${
                        hovered === m.id ? "scale-105" : "scale-100"
                      }`}
                    />
                  </span>
                </span>

                <svg
                  viewBox="0 0 24 24"
                  className="mt-3 h-5 w-5 shrink-0 stroke-current fill-none stroke-[1.5] transition-transform duration-500 group-hover:translate-x-1.5"
                  aria-hidden
                >
                  <path d="M4 12h15M13 6l6 6-6 6" />
                </svg>
              </Link>
            </li>
          ))}
        </ul>

        <div className="reveal mt-10">
          <Link href="/ministries" className="btn btn-ghost text-ink">
            All ministries
          </Link>
        </div>
      </div>
    </section>
  );
}
