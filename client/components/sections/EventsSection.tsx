import Link from "next/link";
import Image from "next/image";
import type { ChurchEvent } from "@/types";

import { site } from "@/config/site";
import { socialLinks } from "@/config/socialLinks";
import { recurringGatherings } from "@/content/events";
import { SectionHead } from "@/components/ui/SectionHead";
import { SocialLinks } from "@/components/ui/SocialLinks";

function fmtDay(iso: string) {
  const d = new Date(`${iso}T12:00:00Z`);
  return {
    day: d.toLocaleDateString("en-GB", { day: "2-digit", timeZone: "UTC" }),
    month: d.toLocaleDateString("en-GB", { month: "short", timeZone: "UTC" }),
    year: d.toLocaleDateString("en-GB", { year: "numeric", timeZone: "UTC" }),
  };
}

export function EventsSection({ events }: { events: ChurchEvent[] }) {
  return (
    <section className="border-b border-line bg-paper-dim py-20 md:py-28">
      <div className="shell">
        <SectionHead
          index="06"
          eyebrow="Gatherings"
          title={
            <>
              What&apos;s
              <br />
              coming up.
            </>
          }
          aside={
            <p className="max-w-md text-[15px] leading-relaxed text-muted">
              Recurring gatherings confirmed from VOBI&apos;s own published schedule. Dated events
              are added here only when the ministry publishes them.
            </p>
          }
        />

        {events.length > 0 ? (
          <ul className="mt-14 border-t border-line">
            {events.map((e) => {
              const d = fmtDay(e.date);
              return (
                <li key={e.id} className="reveal border-b border-line">
                  <Link
                    href="/events"
                    className="group flex flex-col gap-5 py-8 sm:flex-row sm:items-center sm:gap-10"
                  >
                    <span className="flex w-24 shrink-0 items-baseline gap-2">
                      <span className="numeral text-3xl leading-none">{d.day}</span>
                      <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">
                        {d.month}
                      </span>
                    </span>
                    <span className="flex-1">
                      <span className="display-sm block transition-transform duration-500 group-hover:translate-x-1.5">
                        {e.title}
                      </span>
                      <span className="mt-2 block text-[14px] text-muted">
                        {e.location ?? `${site.city}, Zimbabwe`}
                      </span>
                    </span>
                    {e.image && (
                      <span className="block w-40 shrink-0 overflow-hidden">
                        <Image
                          src={e.image}
                          alt=""
                          width={320}
                          height={180}
                          sizes="160px"
                          className="aspect-video w-full object-cover"
                        />
                      </span>
                    )}
                    <svg
                      viewBox="0 0 24 24"
                      className="h-5 w-5 shrink-0 stroke-current fill-none stroke-[1.5] transition-transform duration-500 group-hover:translate-x-1.5"
                      aria-hidden
                    >
                      <path d="M4 12h15M13 6l6 6-6 6" />
                    </svg>
                  </Link>
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="reveal mt-14 border border-line bg-paper px-7 py-12 md:px-12 md:py-16">
            <p className="max-w-2xl font-display text-[clamp(1.35rem,2.6vw,2rem)] leading-[1.2] tracking-[-0.02em]">
              No dated gathering has been published yet. The moment VOBI announces one, it will
              appear on this page.
            </p>
            <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-muted">
              Until then, these are the gatherings that recur across the ministry&apos;s own
              broadcasts — you are always welcome to join live.
            </p>
            <SocialLinks links={socialLinks} className="mt-8" showLabel />
          </div>
        )}

        <ul className="mt-12 grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {recurringGatherings.map((g, i) => (
            <li key={g.title} className="reveal bg-paper-dim px-6 py-8">
              <p className="numeral text-[11px] tracking-[0.2em] text-gold">0{i + 1}</p>
              <h3 className="display-sm mt-4">{g.title}</h3>
              <p className="mt-4 text-[13px] leading-relaxed text-muted">{g.evidence}</p>
            </li>
          ))}
        </ul>

        <div className="reveal mt-10 flex flex-wrap gap-3">
          <Link href="/events" className="btn btn-ink">
            All gatherings
          </Link>
          <Link href="/live" className="btn btn-ghost text-ink">
            Watch instead
          </Link>
        </div>
      </div>
    </section>
  );
}
