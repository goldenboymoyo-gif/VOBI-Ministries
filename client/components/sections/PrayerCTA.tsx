import Link from "next/link";

import { site } from "@/config/site";

export function PrayerCTA() {
  return (
    <section className="relative overflow-hidden border-b border-line bg-ink text-paper">
      <div className="shell py-20 md:py-28">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="reveal lg:col-span-7">
            <p className="eyebrow text-gold-bright">Prayer</p>
            <h2 className="display-md mt-6 max-w-[20ch]">
              Whatever you are carrying, send it to the Lord in prayer.
            </h2>
            <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-paper/70 md:text-base">
              Prayer has been the ministry&apos;s most constant gathering since 2017 — Mass
              Prayer and &ldquo;Pray Along with Prophet Promise&rdquo; run week after week.
              A request sent through this site is read by the ministry and held privately. It
              is never published, listed or shared with anyone else.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/prayer" className="btn btn-solid">
                Send a prayer request
              </Link>
              <a
                href={`tel:${site.prayerPhone.replace(/\s+/g, "")}`}
                className="btn btn-ghost"
              >
                Call the prayer line
              </a>
              <Link href="/sermons?category=sermon" className="btn btn-ghost">
                Teachings on prayer
              </Link>
            </div>
          </div>

          <div className="reveal flex flex-col justify-center border-l border-line-dark pl-8 lg:col-span-5 md:pl-10">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-paper/45">
              Prayer line
            </p>
            <a
              href={`tel:${site.prayerPhone.replace(/\s+/g, "")}`}
              className="mt-3 font-display text-[clamp(1.8rem,4vw,2.9rem)] leading-[1.05] tracking-[-0.02em] text-paper"
            >
              {site.prayerPhone}
            </a>
            <p className="mt-5 text-[13px] leading-relaxed text-paper/50">
              {site.statements.distance}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}