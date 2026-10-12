import Link from "next/link";
import Image from "next/image";

import { site } from "@/config/site";
import { thumb } from "@/lib/media";

export function StatementOfFaith() {
  return (
    <section className="border-b border-line bg-paper py-20 md:py-28">
      <div className="shell grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="reveal lg:col-span-5">
          <div className="frame aspect-[4/3]">
            <Image
              src={thumb("u-fmfu7Kov0")}
              alt="Prayer at Valley of Blessings International Ministries"
              width={1280}
              height={960}
              sizes="(max-width: 1024px) 100vw, 42vw"
              className="object-cover"
            />
          </div>
        </div>

        <div className="reveal lg:col-span-7">
          <p className="eyebrow text-gold">Statement of faith</p>
          <h2 className="display-md mt-6 max-w-[16ch]">What we believe</h2>

          <div className="mt-8 space-y-6 text-[15px] leading-relaxed text-muted md:text-base">
            <p className="border-l-2 border-gold pl-5 font-display text-[1.4rem] leading-[1.3] tracking-[-0.02em] text-ink">
              &ldquo;{site.statements.bioLine}&rdquo;
            </p>
            <p>
              That line, taken from the ministry&apos;s official biography, is what VOBI
              publishes about itself today. The full statement of faith will be published on
              this page exactly as the ministry confirms it.
            </p>
            <p>
              Until then, no creed, article or doctrine is written on VOBI&apos;s behalf. What
              the ministry does publish — its teaching, its services and its prayers — can be
              watched in full below.
            </p>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/about/what-we-believe" className="btn btn-ink">
              Read more
            </Link>
            <Link href="/sermons" className="btn btn-ghost text-ink">
              Watch the teaching
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
