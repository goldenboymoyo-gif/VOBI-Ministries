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
  { img: "/photos/congregation.jpg", tag: "Weekly", t: "Sunday Live Service", d: `Every Sunday at ${site.service.time}. Worship, the Word and ministry, live to the world.` },
  { img: "/photos/praise.jpg", tag: "Weekly", t: "Mass Prayer", d: "The whole church prays together. Mass prayer has been part of VOBI since 2017." },
  { img: "/photos/hero.jpg", tag: "Yearly", t: "Crossover Candle Light Service", d: "We cross into the new year in prayer on 31 December." },
  { img: "/photos/worship.jpg", tag: "Special", t: "Mercy Land / Holy Ground", d: "Special Sunday gatherings, announced on our channels." },
];

export default async function EventsPage() {
  const events = await getEvents();
  return (
    <>
      <Masthead eyebrow="Events" title="Upcoming events" image="/photos/congregation.jpg"
        intro="Join us in Victoria Falls or from wherever you are." meta={<Countdown />} />
      {events.length > 0 && (
        <section className="bg-paper py-16 md:py-20">
          <div className="shell-narrow">
            <h2 className="text-2xl font-extrabold uppercase md:text-3xl">Coming up</h2>
            <ul className="mt-8 divide-y divide-line border-y border-line">
              {events.map((e) => {
                const d = new Date(e.date);
                return (
                  <li key={e.id} className="flex gap-5 py-6">
                    <div className="grid h-20 w-20 shrink-0 place-items-center bg-gold-bright text-center text-ink">
                      <div>
                        <p className="text-3xl font-extrabold leading-none">{d.getDate()}</p>
                        <p className="mt-1 text-xs font-bold uppercase tracking-wider">{d.toLocaleDateString("en-GB", { month: "short" })}</p>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">{e.title}</h3>
                      {e.description && <p className="mt-1 text-muted">{e.description}</p>}
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>
      )}
      <section className="gold-wash py-16 md:py-24">
        <div className="shell">
          <h2 className="text-2xl font-extrabold uppercase md:text-3xl">Regular gatherings</h2>
          <div className="mt-10 grid gap-8 md:grid-cols-2">
            {regular.map((r) => (
              <article key={r.t} className="group overflow-hidden rounded-2xl bg-white shadow-md">
                <div className="relative aspect-[16/9] overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={r.img} alt={r.t} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <span className="absolute left-4 top-4 rounded-full bg-gold-bright px-3 py-1 text-xs font-bold uppercase tracking-wider text-ink">{r.tag}</span>
                </div>
                <div className="p-6 md:p-7">
                  <h3 className="text-xl font-bold">{r.t}</h3>
                  <p className="mt-2 leading-relaxed text-muted">{r.d}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
      <CtaBand title="Never miss a service" text="Follow VOBI on YouTube, Facebook, Instagram and TikTok." href="/live" label="Watch live" />
    </>
  );
}
