import Link from "next/link";

import type { ChurchEvent } from "@/types";
import { recurringGatherings } from "@/content/events";
import { socialLinks } from "@/config/socialLinks";

const descriptors: Record<string, string> = {
  "Sunday Live Service": "Broadcast live every Sunday from Victoria Falls.",
  "Mass Prayer": "A regular part of VOBI's public ministry since 2017.",
  "Crossover Candle Light Service": "The annual 31 December night watch.",
  "Mercy Land / Holy Ground": "Special services announced by the ministry.",
};

function fmtDate(iso: string) {
  return new Date(`${iso}T12:00:00Z`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

export function UpcomingEvents({ events }: { events: ChurchEvent[] }) {
  return (
    <section className="border-b border-line bg-paper-dim py-20 md:py-28">
      <div className="shell grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="reveal lg:col-span-5">
          <p className="eyebrow text-gold">Events</p>
          <h2 className="display-md mt-6 max-w-[14ch]">Upcoming events</h2>

          {events.length === 0 ? (
            <p className="mt-7 max-w-md text-[15px] leading-relaxed text-muted">
              New events will appear here as they are announced by VOBI Ministries.
            </p>
          ) : (
            <ul className="mt-7 space-y-px border border-line bg-line">
              {events.map((e) => (
                <li key={e.id} className="bg-paper-dim px-6 py-5">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-gold">
                    {fmtDate(e.date)}
                  </p>
                  <p className="display-sm mt-2">{e.title}</p>
                  {e.location && <p className="mt-2 text-[14px] text-muted">{e.location}</p>}
                </li>
              ))}
            </ul>
          )}

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/events" className="btn btn-ink">
              All events
            </Link>
            <Link
              href={socialLinks.find((s) => s.platform === "facebook")?.url ?? "/contact"}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-ghost text-ink"
            >
              Follow VOBI
            </Link>
          </div>
        </div>

        <div className="reveal lg:col-span-7">
          <p className="eyebrow text-muted-light">Recurring gatherings</p>
          <ul className="mt-6 border-t border-line">
            {recurringGatherings.map((g) => (
              <li
                key={g.title}
                className="grid gap-2 border-b border-line py-5 md:grid-cols-[1fr_1.4fr] md:gap-8"
              >
                <p className="font-display text-[1.25rem] leading-[1.2] tracking-[-0.02em] text-ink">
                  {g.title}
                </p>
                <p className="text-[14px] leading-relaxed text-muted">
                  {descriptors[g.title] ?? g.evidence}
                </p>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-[13px] leading-relaxed text-muted-light">
            Dated events are published only when VOBI announces them — this site does not
            create dates, venues or registrations of its own.
          </p>
        </div>
      </div>
    </section>
  );
}
