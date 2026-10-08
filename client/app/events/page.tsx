import type { Metadata } from "next";

import { Masthead } from "@/components/ui/Masthead";
import { CtaBand } from "@/components/ui/CtaBand";
import { Countdown } from "@/components/ui/Countdown";
import { getEvents } from "@/lib/data";
import { site } from "@/config/site";

export const metadata: Metadata = {
  title: "Events",
  description: "Sunday services, mass prayer and special gatherings at Valley of Blessings International Ministries.",
  alternates: { canonical: "/events" },
};

const regular = [
  { t: "Sunday Live Service", d: `Every Sunday at ${site.service.time}. Worship, the Word and ministry, live to the world.` },
  { t: "Mass Prayer", d: "The whole church prays together. Mass prayer has been part of VOBI since 2017." },
  { t: "Crossover Candle Light Service", d: "We cross into the new year in prayer on 31 December." },
  { t: "Mercy Land / Holy Ground", d: "Special Sunday gatherings, announced on our channels." },
];

export default async function EventsPage() {
  const events = await getEvents();
  return (
    <>
      <Masthead eyebrow="Events" title="Upcoming events" image="/photos/congregation.jpg"
        intro="Join us in Victoria Falls or from wherever you are." meta={<Countdown />} />
      {events.length > 0 && (
        <section className="bg-paper py-16">
          <div className="shell grid gap-6 md:grid-cols-2">
            {events.map((e) => (
              <article key={e.id} className="reveal border border-line p-8">
                <p className="eyebrow text-gold">{new Date(e.date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</p>
                <h2 className="display-sm mt-3">{e.title}</h2>
                {e.description && <p className="mt-3 text-muted">{e.description}</p>}
              </article>
            ))}
          </div>
        </section>
      )}
      <section className="bg-ink py-16 text-paper md:py-24">
        <div className="shell">
          <h2 className="display-md">Regular gatherings</h2>
          <div className="mt-10 grid gap-px bg-line-dark md:grid-cols-2">
            {regular.map((r) => (
              <div key={r.t} className="reveal bg-ink p-8 md:p-10">
                <h3 className="display-sm text-gold-bright">{r.t}</h3>
                <p className="mt-3 text-paper/70">{r.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <CtaBand title="Never miss a service" text="Follow VOBI on YouTube, Facebook, Instagram and TikTok." href="/live" label="Watch live" />
    </>
  );
}
