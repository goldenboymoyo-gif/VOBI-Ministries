import type { Metadata } from "next";
import Link from "next/link";

import { Masthead } from "@/components/ui/Masthead";
import { site } from "@/config/site";

export const metadata: Metadata = {
  title: "What We Believe",
  description:
    "The statement of faith of Valley of Blessings International Ministries will be published here exactly as the ministry confirms it.",
  alternates: { canonical: "/about/what-we-believe" },
};

export default function WhatWeBelievePage() {
  return (
    <>
      <Masthead
        eyebrow="Statement of faith"
        crumbs={[
          { label: "Home", href: "/" },
          { label: "About", href: "/about" },
          { label: "What We Believe" },
        ]}
        title={
          <>
            What we
            <br />
            believe.
          </>
        }
        intro="The full statement of faith of Valley of Blessings International Ministries will be published on this page exactly as the ministry confirms it."
      />

      <section className="border-b border-line bg-paper py-20 md:py-28">
        <div className="shell-narrow grid gap-14 lg:grid-cols-12 lg:gap-16">
          <div className="reveal lg:col-span-7">
            <p className="eyebrow text-gold">Currently published</p>

            <div className="mt-8 space-y-7 text-[16px] leading-relaxed text-muted">
              <p className="font-display text-[clamp(1.5rem,2.6vw,2.1rem)] leading-[1.25] tracking-[-0.02em] text-ink">
                &ldquo;{site.statements.bioLine}&rdquo;
              </p>
              <p>
                That line is taken verbatim from the ministry&apos;s official biography. It is
                the only statement of belief VOBI has published about itself that can be
                quoted here.
              </p>
              <p>
                Until the ministry supplies its full statement of faith, no creed, article or
                doctrine is written on VOBI&apos;s behalf. Nothing on this page is a summary,
                paraphrase or interpretation of what the ministry believes.
              </p>
              <p>
                The teaching itself is the clearest account available: every sermon and
                service ministered by Prophet Promise is published in full on the
                ministry&apos;s official channel and can be watched through this site.
              </p>
            </div>

            <div className="mt-10 flex flex-wrap gap-3">
              <Link href="/sermons" className="btn btn-ink">
                Watch the teaching
              </Link>
              <Link href="/about" className="btn btn-ghost text-ink">
                About the ministry
              </Link>
              <Link href="/contact" className="btn btn-ghost text-ink">
                Contact VOBI
              </Link>
            </div>
          </div>

          <aside className="reveal lg:col-span-5">
            <div className="border border-line bg-paper-dim px-7 py-9">
              <p className="eyebrow text-muted-light">Ministry confirmation</p>
              <p className="mt-6 text-[14.5px] leading-relaxed text-muted">
                When Valley of Blessings International Ministries supplies its statement of
                faith, it will replace this notice word for word — approved text only, with no
                editorial additions.
              </p>
            </div>

            <div className="mt-6 border border-line px-7 py-9">
              <p className="eyebrow text-muted-light">In the ministry&apos;s own words</p>
              <p className="mt-6 font-display text-[1.35rem] leading-[1.28] tracking-[-0.02em] text-ink">
                &ldquo;{site.statements.distance}&rdquo;
              </p>
              <p className="mt-4 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-light">
                Recurring line in VOBI&apos;s own titles and descriptions
              </p>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
