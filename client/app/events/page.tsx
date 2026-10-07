import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

import { Masthead } from "@/components/ui/Masthead";
import { getEvents } from "@/lib/data";
import { recurringGatherings } from "@/content/events";
import { socialLinks } from "@/config/socialLinks";
import { site } from "@/config/site";
import { SocialLinks } from "@/components/ui/SocialLinks";

export const metadata: Metadata = {
  title: "Events",
  description:
    "Upcoming gatherings at Valley of Blessings International Ministries in Victoria Falls, Zimbabwe, and the recurring services published by VOBI.",
  alternates: { canonical: "/events" },
};

function fmt(iso: string, opts: Intl.DateTimeFormatOptions) {
  return new Date(`${iso}T12:00:00Z`).toLocaleDateString("en-GB", { ...opts, timeZone: "UTC" });
}

export default async function EventsPage() {
  const events = await getEvents();

  return (
    <>
      <Masthead
        eyebrow="Gatherings"
        crumbs={[{ label: "Home", href: "/" }, { label: "Events" }]}
        title={
          <>
            Come and
            <br />
            gather <em className="not-italic text-gold-bright">with us</em>.
          </>
        }
        intro="Dated gatherings appear here as soon as VOBI publishes them. Until then, these are the services that recur across the ministry's own broadcast record."
      />

      <section className="bg-paper py-20 md:py-28">
        <div className="shell">
          {events.length > 0 ? (
            <ul className="border-t border-line">
              {events.map((e) => (
                <li key={e.id} className="reveal border-b border-line">
                  <article className="flex flex-col gap-5 py-9 sm:flex-row sm:items-start sm:gap-10">
                    <span className="flex w-28 shrink-0 items-baseline gap-2">
                      <span className="numeral text-4xl leading-none">
                        {fmt(e.date, { day: "2-digit" })}
                      </span>
                      <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">
                        {fmt(e.date, { month: "short" })}
                      </span>
                    </span>
                    <span className="flex-1">
                      <span className="display-md block">{e.title}</span>
                      <span className="mt-3 block text-[14px] text-muted">
                        {[e.time, e.location ?? `${site.city}, Zimbabwe`].filter(Boolean).join(" · ")}
                      </span>
                      {e.description && (
                        <span className="mt-4 block max-w-2xl text-[14px] leading-relaxed text-muted">
                          {e.description}
                        </span>
                      )}
                      {e.registrationUrl && (
                        <a
                          href={e.registrationUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-ghost mt-6 text-ink"
                        >
                          Register
                        </a>
                      )}
                    </span>
                    {e.image && (
                      <Image
                        src={e.image}
                        alt=""
                        width={320}
                        height={180}
                        sizes="200px"
                        className="aspect-video w-52 shrink-0 object-cover"
                      />
                    )}
                  </article>
                </li>
              ))}
            </ul>
          ) : (
            <div className="reveal border border-line bg-paper-dim px-7 py-14 md:px-14 md:py-20">
              <p className="max-w-3xl font-display text-[clamp(1.5rem,3vw,2.5rem)] leading-[1.14] tracking-[-0.025em]">
                No dated event has been announced yet. Nothing is invented here to fill the
                page — the moment VOBI publishes one, it appears below.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link href="/live" className="btn btn-ink">
                  Watch the next service live
                </Link>
                <SocialLinks links={socialLinks} showLabel />
              </div>
            </div>
          )}

          <div className="mt-20">
            <p className="eyebrow text-gold">Recurring gatherings</p>
            <ul className="mt-8 grid gap-px border border-line bg-line md:grid-cols-2">
              {recurringGatherings.map((g, i) => (
                <li key={g.title} className="reveal bg-paper px-7 py-9 md:px-9 md:py-11">
                  <p className="numeral text-[11px] tracking-[0.2em] text-muted-light">
                    0{i + 1}
                  </p>
                  <h2 className="display-sm mt-4">{g.title}</h2>
                  <p className="mt-4 text-[14px] leading-relaxed text-muted">{g.evidence}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
