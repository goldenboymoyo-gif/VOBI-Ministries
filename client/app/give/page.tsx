import type { Metadata } from "next";

import { getSettings, getSite } from "@/lib/settings";
import { PageNote } from "@/components/ui/PageNote";
import { Masthead } from "@/components/ui/Masthead";
import { Split } from "@/components/ui/Split";
import { site, whatsappUrl } from "@/config/site";

export const metadata: Metadata = {
  title: "Give & Partner",
  description: "Give to the work of Valley of Blessings International Ministries.",
  alternates: { canonical: "/give" },
};

export default async function GivePage() {
  const site = await getSite();
  const notes = (await getSettings()).notes ?? {};
  return (
    <>
      <Masthead eyebrow="Give & partner" title="Sow into the work" image="/photos/worship.jpg" intro="Your giving carries the service, the outreach and the broadcast to people who need it." />
      <Split image="/photos/praise.jpg" alt="Worship at VOBI" title="Where giving goes">
        <p>VOBI&apos;s work includes the Sunday service and its live broadcast, mass prayer, humanitarian outreach and trips into Botswana and Zambia.</p>
        <p>To give or become a partner, contact the ministry directly. We will tell you the ways to give.</p>
      </Split>
      <section className="bg-paper py-16 md:py-20">
        <div className="shell">
          <h2 className="text-2xl font-extrabold uppercase md:text-3xl">Two ways to stand with us</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <article className="rounded-2xl bg-white p-7 shadow-md">
              <p className="text-xs font-bold uppercase tracking-wider text-gold">Give</p>
              <h3 className="mt-2 text-xl font-bold">Tithes, offerings and seed</h3>
              <p className="mt-3 leading-relaxed text-muted">Give once or whenever you are led: tithes, offerings, or a seed for a specific need such as outreach, the broadcast or a building project.</p>
            </article>
            <article className="rounded-2xl bg-white p-7 shadow-md">
              <p className="text-xs font-bold uppercase tracking-wider text-gold">Partner</p>
              <h3 className="mt-2 text-xl font-bold">Become a VOBI partner</h3>
              <p className="mt-3 leading-relaxed text-muted">Partners commit to pray for and support the ministry regularly, and walk with us as the Gospel reaches more people in Zimbabwe, Botswana, Zambia and online.</p>
            </article>
          </div>
          <h3 className="mt-12 text-xl font-bold">What your support does</h3>
          <ul className="mt-4 grid gap-3 text-muted md:grid-cols-2">
            <li className="rounded-xl border border-line bg-white p-4">Keeps the Sunday service and the live broadcast on air</li>
            <li className="rounded-xl border border-line bg-white p-4">Supports mass prayer and the prayer lines</li>
            <li className="rounded-xl border border-line bg-white p-4">Funds humanitarian outreach and feeding of families</li>
            <li className="rounded-xl border border-line bg-white p-4">Carries mission trips and new branches</li>
          </ul>
          <h3 className="mt-12 text-xl font-bold">How to give or partner</h3>
          <ol className="mt-4 list-decimal space-y-2 pl-6 text-muted">
            <li>Message us on WhatsApp or email using the buttons below.</li>
            <li>Tell us if you want to give once or partner monthly, and from which country.</li>
            <li>We will reply with the ways to give that work for you.</li>
          </ol>
        </div>
      </section>
      <PageNote text={notes.give} />
      <section className="bg-ink py-16 text-paper md:py-20">
        <div className="shell flex flex-wrap items-center gap-4">
          <a href={whatsappUrl(site.phone ?? "")} className="btn btn-gold">WhatsApp {site.phone}</a>
          <a href={`mailto:${site.email}`} className="btn btn-ghost">Email us</a>
        </div>
      </section>
    </>
  );
}
