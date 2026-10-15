import type { Metadata } from "next";

import { Masthead } from "@/components/ui/Masthead";
import { CtaBand } from "@/components/ui/CtaBand";
import { Countdown } from "@/components/ui/Countdown";
import { getEvents } from "@/lib/data";

export const metadata: Metadata = {
  title: "Events",
  description: "Sunday services, mass prayer and special gatherings at Valley of Blessings International Ministries.",
  alternates: { canonical: "/events" },
};

export default async function EventsPage() {
  const events = await getEvents();
  return (
    <>
      <Masthead eyebrow="Events" title="Upcoming events" image="/photos/congregation.jpg"
        intro="Join us in Victoria Falls or from wherever you are." meta={<Countdown />} />
      <section className="bg-paper py-16 md:py-20">
        <div className="shell">
          {events.length === 0 ? (
            <p className="mx-auto max-w-md text-center text-muted">No events right now. New events will appear here when they are announced.</p>
          ) : (
            <div className="grid gap-8 md:grid-cols-2">
              {events.map((e) => {
                const d = new Date(`${e.date}T12:00:00Z`);
                return (
                  <article key={e.id} className="overflow-hidden rounded-2xl bg-white shadow-md">
                    {e.image && (
                      <div className="relative aspect-[16/9] overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={e.image} alt={e.title} loading="lazy" className="h-full w-full object-cover" />
                      </div>
                    )}
                    <div className="p-6 md:p-7">
                      <p className="text-sm font-bold uppercase tracking-wider text-gold">
                        {d.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: "UTC" })}{e.time ? ` \u00b7 ${e.time}` : ""}
                      </p>
                      <h3 className="mt-2 text-xl font-bold">{e.title}</h3>
                      {e.location && <p className="mt-1 text-sm font-semibold text-muted">{e.location}</p>}
                      {e.description && <p className="mt-3 whitespace-pre-line leading-relaxed text-muted">{e.description}</p>}
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>
      <CtaBand title="Never miss a service" text="Follow VOBI on YouTube, Facebook, Instagram and TikTok." href="/live" label="Watch live" />
    </>
  );
}
