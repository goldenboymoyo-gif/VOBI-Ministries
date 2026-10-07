import Link from "next/link";

import { site } from "@/config/site";
import { SectionHead } from "@/components/ui/SectionHead";

const facts = [
  { k: "Ministry", v: site.fullName },
  { k: "City", v: `${site.city}, ${site.country}` },
  { k: "Address", v: site.address },
  { k: "Leadership", v: "Prophet Promise" },
  { k: "Service", v: `${site.service.day} · ${site.service.time}` },
  { k: "Channel record", v: "882 videos on the official channel" },
];

export function AboutIntro() {
  return (
    <section className="border-b border-line bg-paper py-20 md:py-28">
      <div className="shell">
        <SectionHead
          eyebrow="Introduction"
          title={
            <>
              A church in {site.city}, gathered around the Word of God.
            </>
          }
        />

        <div className="mt-14 grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="reveal space-y-6 text-[15px] leading-relaxed text-muted lg:col-span-7 md:text-base">
            <p>
              {site.fullName} is a church in the Mkhosana suburb of {site.city},{" "}
              {site.country}, ministered by Prophet Promise. Every Sunday service, mass
              prayer and teaching is gathered from Scripture and carried live on the
              ministry&apos;s own channels.
            </p>
            <p>
              That means a congregation in Victoria Falls and a viewer thousands of
              kilometres away are watching the same meeting, at the same time — the
              ministry&apos;s own words for it are carried on every broadcast below.
            </p>
            <p className="border-l-2 border-gold pl-5 font-display text-[1.3rem] leading-[1.3] tracking-[-0.02em] text-ink">
              {site.statements.distance}
            </p>
          </div>

          <aside className="reveal lg:col-span-5">
            <dl className="border-t border-line">
              {facts.map((f) => (
                <div key={f.k} className="grid grid-cols-[10rem_1fr] gap-4 border-b border-line py-4">
                  <dt className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-light">
                    {f.k}
                  </dt>
                  <dd className="text-[14px] leading-relaxed text-ink">{f.v}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/about" className="btn btn-ink">
                About the ministry
              </Link>
              <Link href="/about/leadership" className="btn btn-ghost text-ink">
                Prophet Promise
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}