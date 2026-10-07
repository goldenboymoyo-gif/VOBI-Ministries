import type { Metadata } from "next";
import Link from "next/link";

import { site } from "@/config/site";
import { socialLinks } from "@/config/socialLinks";
import { Masthead } from "@/components/ui/Masthead";
import { SocialLinks } from "@/components/ui/SocialLinks";

export const metadata: Metadata = {
  title: "About",
  description: `Who ${site.fullName} is: the ministry, its location in ${site.city}, its leadership and the story that can be verified.`,
  alternates: { canonical: "/about" },
};

const pillars = [
  {
    href: "/about/story",
    title: "Our Story",
    body: "Only what can be dated — the ministry's record from 2016 to today, entry by entry.",
  },
  {
    href: "/about/leadership",
    title: "Leadership",
    body: "Prophet Promise, the ministry VOBI publishes under, and the limits of what is publicly known.",
  },
  {
    href: "/ministries",
    title: "Our Ministries",
    body: "The four works VOBI documents in its own uploads — worship, prayer, testimony and outreach.",
  },
];

export default function AboutPage() {
  return (
    <>
      <Masthead
        eyebrow="About the ministry"
        crumbs={[{ label: "Home", href: "/" }, { label: "About" }]}
        title={
          <>
            Because of Christ
            <br />
            we are <em className="not-italic text-gold-bright">saved</em>.
          </>
        }
        intro={`${site.fullName} is a church in ${site.city}, ${site.country}, ministered by Prophet Promise and carried live to viewers around the globe.`}
        meta={<SocialLinks links={socialLinks} tone="reverse" showLabel />}
      />

      <section className="border-b border-line bg-paper py-20 md:py-28">
        <div className="shell grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="reveal lg:col-span-7">
            <p className="eyebrow text-gold">The short version</p>
            <div className="mt-6 space-y-6 text-[15px] leading-relaxed text-muted md:text-base">
              <p className="font-display text-[clamp(1.4rem,2.4vw,2rem)] leading-[1.25] tracking-[-0.02em] text-ink">
                {site.statements.welcome}
              </p>
              <p>
                VOBI gathers at {site.address}. Services, mass prayer and teaching are published on
                the ministry&apos;s own channels, where the record now runs to more than eight
                hundred videos.
              </p>
              <p>
                Everything on this site is drawn from that record or supplied directly by the
                ministry. Where VOBI has not published something — a founding date, a recurring
                schedule for each ministry — this site says so plainly instead of filling the
                space with a guess.
              </p>
            </div>

            <div className="mt-10 flex flex-wrap gap-3">
              <Link href="/visit" className="btn btn-ink">
                Plan your visit
              </Link>
              <Link href="/live" className="btn btn-ghost text-ink">
                Watch live
              </Link>
            </div>
          </div>

          <div className="reveal lg:col-span-5">
            <dl className="border-t border-line">
              {[
                { k: "Full name", v: site.fullName },
                { k: "Leader", v: "Prophet Promise" },
                { k: "City", v: `${site.city}, Matabeleland North` },
                { k: "Address", v: site.address },
                {
                  k: "Telephone",
                  v: site.phone,
                  href: `tel:${site.phone.replace(/\s+/g, "")}`,
                },
                {
                  k: "Prayer line",
                  v: site.prayerPhone,
                  href: `tel:${site.prayerPhone.replace(/\s+/g, "")}`,
                },
                { k: "Email", v: site.email, href: `mailto:${site.email}` },
              ].map((r) => (
                <div key={r.k} className="grid grid-cols-[9rem_1fr] gap-4 border-b border-line py-5">
                  <dt className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-light">
                    {r.k}
                  </dt>
                  <dd className="text-[14px] leading-relaxed text-ink">
                    {r.href ? (
                      <a href={r.href} className="link-underline">
                        {r.v}
                      </a>
                    ) : (
                      r.v
                    )}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      <section className="bg-paper-dim py-20 md:py-28">
        <div className="shell grid gap-px border border-line bg-line md:grid-cols-3">
          {pillars.map((p) => (
            <Link key={p.href} href={p.href} className="group reveal bg-paper-dim px-7 py-10 md:px-8 md:py-12">
              <h2 className="display-sm transition-transform duration-500 group-hover:translate-x-1.5">
                {p.title}
              </h2>
              <p className="mt-4 text-[14px] leading-relaxed text-muted">{p.body}</p>
              <span className="mt-7 inline-block text-[11px] font-semibold uppercase tracking-[0.18em] text-gold">
                Read →
              </span>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
