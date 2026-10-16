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
            <div className="mx-auto grid max-w-5xl gap-8">
              {events.map((e) => {
                const d = new Date(`${e.date}T12:00:00Z`);
                return (
                  <article key={e.id} className="overflow-hidden rounded-2xl bg-white shadow-md md:flex">
                    {e.image && (
                      <div className="md:w-[320px] md:shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={e.image} alt={e.title} loading="lazy" className="block h-auto w-full" />
                      </div>
                    )}
                    <div className="p-6 md:flex md:flex-1 md:flex-col md:justify-center md:p-10">
                      <p className="text-sm font-bold uppercase tracking-wider text-gold">
                        {d.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: "UTC" })}{e.time ? ` \u00b7 ${e.time}` : ""}
                      </p>
                      <h3 className="mt-2 text-xl font-bold md:text-3xl">{e.title}</h3>
                      {e.location && <p className="mt-1 text-sm font-semibold text-muted">{e.location}</p>}
                      {e.description && <p className="mt-4 whitespace-pre-line leading-relaxed text-muted md:text-lg">{e.description}</p>}
                      <div className="mt-6 flex flex-wrap gap-3">
                        <a href={"https://wa.me/?text=" + encodeURIComponent(e.title + " - " + d.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }) + (e.time ? " at " + e.time : "") + (e.location ? ", " + e.location : "") + " https://www.vobiministries.org/events")} target="_blank" rel="noopener noreferrer" className="inline-flex items-center rounded-full bg-ink px-5 py-2.5 text-sm font-bold uppercase tracking-wider text-white transition hover:bg-gold hover:text-ink">Share on WhatsApp</a>
                        {e.location && <a href={"https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(e.location)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center rounded-full border-2 border-ink px-5 py-2.5 text-sm font-bold uppercase tracking-wider text-ink transition hover:bg-ink hover:text-white">Get directions</a>}
                      </div>
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
