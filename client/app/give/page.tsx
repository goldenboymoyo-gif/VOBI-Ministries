import type { Metadata } from "next";

import { getSettings, getSite } from "@/lib/settings";
import { PageNote } from "@/components/ui/PageNote";
import { Masthead } from "@/components/ui/Masthead";
import { whatsappUrl } from "@/config/site";
import { GiveForms } from "@/components/ui/GiveForms";

export const metadata: Metadata = {
  title: "Give & Partner",
  description: "Give to the work of Valley of Blessings International Ministries, or become a VOBI partner.",
  alternates: { canonical: "/give" },
};

const goes = [
  "Keeps the Sunday service and the live broadcast on air",
  "Supports mass prayer and the prayer lines",
  "Funds humanitarian outreach and the feeding of families",
  "Carries mission trips into Botswana and Zambia",
];

export default async function GivePage() {
  const site = await getSite();
  const notes = (await getSettings()).notes ?? {};
  const wa = whatsappUrl(site.phone ?? "");
  return (
    <>
      <Masthead eyebrow="Give & partner" title="Sow into the work" image="/photos/congregation.jpg" intro="Your giving carries the service, the outreach and the broadcast to people who need it." />

      <section className="border-b border-line bg-paper py-16 md:py-24">
        <div className="shell grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <p className="eyebrow text-gold">Give and partner</p>
            <h2 className="display-md mt-6 max-w-[14ch]">Choose how to give</h2>
            <blockquote className="mt-8 border-l-2 border-gold pl-5">
              <p className="text-[1.05rem] italic leading-relaxed text-ink">
                Give, and it shall be given unto you; good measure, pressed down, and shaken together, and running over, shall men give into your bosom.
              </p>
              <footer className="mt-3 text-sm font-semibold text-muted">Luke 6:38</footer>
            </blockquote>
            <p className="mt-8 max-w-md text-[15px] leading-relaxed text-muted">
              Every gift, large or small, keeps the Sunday service on air, carries prayer to people who cannot reach us, and feeds families in need. Choose how you would like to give or partner and we will confirm with you personally.
            </p>
          </div>
          <div className="lg:col-span-7"><GiveForms /></div>
        </div>
      </section>

      <section className="border-b border-line bg-paper-dim py-16 md:py-24">
        <div className="shell grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-6">
            <div className="relative aspect-[5/6] overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/photos/partner.jpg" alt="Church members taking notes from the Bible during a VOBI service" loading="lazy" className="h-full w-full object-cover object-top" />
            </div>
          </div>
          <div className="lg:col-span-6">
            <p className="eyebrow text-gold">Partnership</p>
            <h2 className="display-md mt-6 max-w-[16ch]">Walk with us, month by month</h2>
            <p className="mt-6 max-w-lg text-[15px] leading-relaxed text-muted">
              Partners stand with the ministry in prayer and in giving, so the Gospel keeps reaching people in Zimbabwe, Botswana, Zambia and online.
            </p>
            <ol className="mt-8 border-t border-line">
              {[
                ["Tell us about you", "Choose Partner with us above and send the short form."],
                ["We welcome you", "Someone from the ministry contacts you to agree how you want to partner."],
                ["Stay connected", "You receive prayer and updates on what your partnership is doing."],
              ].map(([t, d], i) => (
                <li key={t} className="grid grid-cols-[3rem_1fr] gap-4 border-b border-line py-5">
                  <span className="font-display text-[1.6rem] text-gold">{i + 1}</span>
                  <span><span className="block font-semibold text-ink">{t}</span><span className="mt-1 block text-[15px] leading-relaxed text-muted">{d}</span></span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section className="bg-paper py-16 md:py-24">
        <div className="shell grid gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <p className="eyebrow text-gold">Where it goes</p>
            <h2 className="display-md mt-6 max-w-[14ch]">What your giving does</h2>
          </div>
          <ul className="border-t border-line lg:col-span-7">
            {goes.map((g) => (
              <li key={g} className="border-b border-line py-5 text-[1.05rem] text-ink">{g}</li>
            ))}
          </ul>
        </div>
      </section>

      <PageNote text={notes.give} />
      <section className="bg-ink py-16 text-paper md:py-20">
        <div className="shell flex flex-wrap items-center gap-4">
          <p className="mr-4 text-[1.1rem]">Questions about giving or partnering? Talk to us directly.</p>
          <a href={wa} className="btn btn-gold">WhatsApp {site.phone}</a>
          <a href={`mailto:${site.email}`} className="btn btn-ghost">Email us</a>
        </div>
      </section>
    </>
  );
}