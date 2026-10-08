import type { Metadata } from "next";
import Link from "next/link";

import { Masthead } from "@/components/ui/Masthead";
import { ServiceTime } from "@/components/ui/ServiceTime";
import { site, mapsDirectionsUrl, mapsEmbedUrl } from "@/config/site";

export const metadata: Metadata = {
  title: "Plan Your Visit",
  description: `Find Valley of Blessings International Ministries in Victoria Falls, Zimbabwe: ${site.address}. Telephone ${site.phone}, directions, map and what to expect.`,
  alternates: { canonical: "/visit" },
};

const expect = [
  {
    title: "You are welcome, wherever you are",
    body: "VOBI introduces every broadcast with the same line: viewers around the globe are welcomed into the service. Whether you are in Victoria Falls or watching from another country, you are being spoken to.",
  },
  {
    title: "The service is not rushed",
    body: "Recent Sunday broadcasts have run past seven hours — teaching, worship, mass prayer and ministry to individuals. Come expecting to stay a while.",
  },
  {
    title: "Come with your request",
    body: "Mass prayer is a regular part of the meeting. If you would rather send your request ahead of time, the prayer page keeps it private and unpublished.",
  },
];

export default function VisitPage() {
  return (
    <>
      <Masthead image="/photos/congregation.jpg"
        eyebrow="Plan your visit"
        crumbs={[{ label: "Home", href: "/" }, { label: "Plan Your Visit" }]}
        title={
          <>
            Find your
            <br />
            way to <em className="not-italic text-gold-bright">VOBI</em>.
          </>
        }
        intro="The ministry gathers in the Mkhosana suburb of Victoria Falls, Matabeleland North, Zimbabwe."
        meta={
          <div className="flex flex-wrap gap-3">
            <a
              href={mapsDirectionsUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-solid"
            >
              Get directions
            </a>
            <Link href="/contact" className="btn btn-ghost">
              Ask a question
            </Link>
          </div>
        }
      />

      <section className="border-b border-line bg-paper py-20 md:py-28">
        <div className="shell grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="reveal lg:col-span-5">
            <p className="eyebrow text-gold">Where to find us</p>
            <dl className="mt-8 border-t border-line">
              {[
                { k: "Address", v: site.address },
                { k: "City", v: `${site.city}, Matabeleland North` },
                { k: "Country", v: site.country },
                { k: "Telephone", v: site.phone, href: `tel:${site.phone.replace(/\s+/g, "")}` },
                {
                  k: "Prayer line",
                  v: site.prayerPhone,
                  href: `tel:${site.prayerPhone.replace(/\s+/g, "")}`,
                },
                { k: "Email", v: site.email, href: `mailto:${site.email}` },
              ].map((r) => (
                <div key={r.k} className="border-b border-line py-5">
                  <dt className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-light">
                    {r.k}
                  </dt>
                  <dd className="mt-2 text-[15px] leading-relaxed text-ink">
                    {r.href ? (
                      r.href.startsWith("/") ? (
                        <Link href={r.href} className="link-underline">
                          {r.v}
                        </Link>
                      ) : (
                        <a href={r.href} className="link-underline">
                          {r.v}
                        </a>
                      )
                    ) : (
                      r.v
                    )}
                  </dd>
                </div>
              ))}
              <div className="border-b border-line py-5">
                <dt className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-light">
                  Service times
                </dt>
                <dd className="mt-2 text-[15px] leading-relaxed text-muted">
                  <ServiceTime />
                </dd>
              </div>
            </dl>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${site.coordinates.lat},${site.coordinates.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-ink"
              >
                Open in Google Maps
              </a>
            </div>
          </div>

          <div className="reveal lg:col-span-7">
            <div className="relative aspect-[4/3] w-full border border-line bg-paper-dim md:aspect-[16/10]">
              <iframe
                title={`Map showing ${site.fullName} in ${site.city}`}
                src={mapsEmbedUrl()}
                className="absolute inset-0 h-full w-full grayscale-[0.3] contrast-[1.05]"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            <p className="mt-4 text-[12px] text-muted-light">
              Marked at {site.coordinates.lat.toFixed(5)}, {site.coordinates.lng.toFixed(5)} — the
              coordinates published for the ministry.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-paper-dim py-20 md:py-28">
        <div className="shell">
          <p className="eyebrow text-gold">What to expect</p>
          <div className="mt-8 grid gap-px border border-line bg-line md:grid-cols-3">
            {expect.map((e) => (
              <article key={e.title} className="reveal bg-paper-dim px-7 py-9 md:px-8 md:py-11">
                <h2 className="display-sm">{e.title}</h2>
                <p className="mt-4 text-[14px] leading-relaxed text-muted">{e.body}</p>
              </article>
            ))}
          </div>

          <div className="reveal mt-14 flex flex-wrap gap-3">
            <Link href="/live" className="btn btn-ink">
              Watch instead
            </Link>
            <Link href="/contact" className="btn btn-ghost text-ink">
              Contact the ministry
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
