import type { Metadata } from "next";

import { getSettings, getSite } from "@/lib/settings";
import { PageNote } from "@/components/ui/PageNote";
import { Masthead } from "@/components/ui/Masthead";
import { whatsappUrl } from "@/config/site";

export const metadata: Metadata = {
  title: "Give & Partner",
  description: "Give to the work of Valley of Blessings International Ministries, or become a VOBI partner.",
  alternates: { canonical: "/give" },
};

const ways = [
  { tag: "Give", t: "Give online", d: "Send your gift from anywhere in the world by mobile money, card or online transfer. Message us and we will share the option that works in your country." },
  { tag: "Give", t: "One-time offering", d: "Sow a seed for a single need: the Sunday service, the broadcast, an outreach or a project. Tell us what is on your heart." },
  { tag: "Give", t: "Bank transfer", d: "Prefer the bank? Ask for our account details and we will send them to you directly." },
];

const goes = [
  "Keeps the Sunday service and the live broadcast on air",
  "Supports mass prayer and the prayer lines",
  "Funds humanitarian outreach and the feeding of families",
  "Carries mission trips into Botswana and Zambia, and new branches",
];

export default async function GivePage() {
  const site = await getSite();
  const notes = (await getSettings()).notes ?? {};
  const wa = whatsappUrl(site.phone ?? "");
  return (
    <>
      <Masthead eyebrow="Give & partner" title="Sow into the work" image="/photos/congregation.jpg" intro="Your giving carries the service, the outreach and the broadcast to people who need it." />

      <section className="bg-ink py-16 text-paper md:py-20">
        <div className="shell-narrow text-center">
          <p className="text-xs font-bold uppercase tracking-wider text-gold-bright">Seed time and harvest</p>
          <h2 className="mt-4 text-2xl font-extrabold uppercase md:text-4xl">Give, and it shall be given to you</h2>
          <p className="mx-auto mt-5 max-w-2xl leading-relaxed text-paper/80">
            Giving is planting. What we sow in faith, God multiplies, for the one who gives and for the Gospel that reaches more people. See Luke 6:38 and Malachi 3:10.
          </p>
        </div>
      </section>

      <section className="bg-paper py-16 md:py-20">
        <div className="shell">
          <h2 className="text-2xl font-extrabold uppercase md:text-3xl">Ways to give</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {ways.map((w) => (
              <article key={w.t} className="flex flex-col rounded-2xl bg-white p-7 shadow-md">
                <p className="text-xs font-bold uppercase tracking-wider text-gold">{w.tag}</p>
                <h3 className="mt-2 text-xl font-bold">{w.t}</h3>
                <p className="mt-3 flex-1 leading-relaxed text-muted">{w.d}</p>
                <a href={wa} className="btn btn-gold mt-6 self-start">Ask how</a>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="gold-wash py-16 md:py-24">
        <div className="shell grid items-center gap-10 md:grid-cols-2">
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-md">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/photos/hero.jpg" alt="Prophet Promise praying for a member of the congregation" loading="lazy" className="h-full w-full object-cover" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-gold">Partner</p>
            <h2 className="mt-2 text-2xl font-extrabold uppercase md:text-3xl">Become a VOBI partner</h2>
            <p className="mt-4 leading-relaxed text-muted">
              Partners commit to pray for and support the ministry regularly. Together we take the Gospel to more people in Zimbabwe, Botswana, Zambia and online.
            </p>
            <ol className="mt-5 list-decimal space-y-2 pl-6 text-muted">
              <li>Message us on WhatsApp or by email.</li>
              <li>Tell us your name, your country and how you would like to partner.</li>
              <li>We will welcome you and share the ways to give that suit you.</li>
            </ol>
          </div>
        </div>
      </section>

      <section className="bg-paper py-16 md:py-20">
        <div className="shell">
          <h2 className="text-2xl font-extrabold uppercase md:text-3xl">What your giving does</h2>
          <ul className="mt-6 grid gap-3 text-muted md:grid-cols-2">
            {goes.map((g) => (
              <li key={g} className="rounded-xl border border-line bg-white p-4">{g}</li>
            ))}
          </ul>
        </div>
      </section>

      <PageNote text={notes.give} />
      <section className="bg-ink py-16 text-paper md:py-20">
        <div className="shell flex flex-wrap items-center gap-4">
          <a href={wa} className="btn btn-gold">WhatsApp {site.phone}</a>
          <a href={`mailto:${site.email}`} className="btn btn-ghost">Email us</a>
        </div>
      </section>
    </>
  );
}