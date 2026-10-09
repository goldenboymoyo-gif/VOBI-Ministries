import type { Metadata } from "next";
import Image from "next/image";

import { Masthead } from "@/components/ui/Masthead";
import { CtaBand } from "@/components/ui/CtaBand";
import { getMinistries } from "@/lib/data";

export const metadata: Metadata = {
  title: "Ministries",
  description: "Worship, prayer, deliverance and outreach at Valley of Blessings International Ministries.",
  alternates: { canonical: "/ministries" },
};

export default async function MinistriesPage() {
  const ministries = await getMinistries();
  return (
    <>
      <Masthead eyebrow="Ministries" title="How we serve" image="/photos/worship.jpg"
        intro="Worship, prayer, deliverance and outreach in Victoria Falls and beyond." />
      <section className="bg-paper py-16 md:py-24">
        <div className="shell space-y-16 md:space-y-24">
          {ministries.map((m, i) => (
            <article key={m.id} id={m.slug} className="grid scroll-mt-32 items-center gap-8 md:gap-14 lg:grid-cols-2">
              <div className={`relative aspect-[4/3] overflow-hidden bg-paper-deep shadow-lg ${i % 2 ? "lg:order-2" : ""}`}>
                <Image src={m.image} alt={m.name} fill sizes="(max-width: 1024px) 100vw, 50vw" unoptimized={m.image.startsWith("http") || m.image.startsWith("/api/")} className="object-cover" />
              </div>
              <div>
                <h2 className="text-2xl font-extrabold uppercase md:text-3xl">{m.name}</h2>
                <div className="mt-3 h-1 w-14 bg-gold-bright" />
                <p className="mt-5 text-lg font-medium leading-snug text-ink">{m.summary}</p>
                <div className="mt-4 space-y-4 leading-relaxed text-muted">
                  {m.body.map((p, k) => <p key={k}>{p}</p>)}
                </div>
                {m.gathering && <p className="mt-6 inline-block bg-white px-4 py-3 text-sm font-semibold text-gold shadow-sm">{m.gathering}</p>}
              </div>
            </article>
          ))}
        </div>
      </section>
      <CtaBand title="Be part of the work" text="Give, partner or join us on Sunday." href="/give" label="Give & partner" />
    </>
  );
}
