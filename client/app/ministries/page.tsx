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
      {ministries.map((m, i) => (
        <section key={m.id} id={m.slug} className="relative isolate overflow-hidden bg-ink text-white">
          <Image src={m.image} alt="" fill sizes="100vw" unoptimized={m.image.startsWith("http")} className="-z-10 object-cover opacity-35" />
          <div className="shell grid py-20 md:py-28 lg:grid-cols-12">
            <div className={`reveal ${i % 2 ? "lg:col-span-7 lg:col-start-6" : "lg:col-span-7"}`}>
              <p className="text-7xl font-extrabold leading-none text-gold-bright md:text-8xl">0{i + 1}</p>
              <h2 className="mt-4 text-3xl font-extrabold uppercase md:text-4xl">{m.name}</h2>
              <p className="mt-4 text-xl leading-snug text-white/90">{m.summary}</p>
              <div className="mt-6 space-y-4 text-[16px] leading-relaxed text-white/75">
                {m.body.map((p, k) => <p key={k}>{p}</p>)}
              </div>
              {m.gathering && <p className="mt-6 border-l-4 border-gold-bright pl-4 font-semibold text-gold-bright">{m.gathering}</p>}
            </div>
          </div>
        </section>
      ))}
      <CtaBand title="Be part of the work" text="Give, partner or join us on Sunday." href="/give" label="Give & partner" />
    </>
  );
}
