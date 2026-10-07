import Link from "next/link";

import { site } from "@/config/site";
import { SectionHead } from "@/components/ui/SectionHead";

const foundations = [
  {
    quote: site.statements.bioLine,
    source: "The ministry's official biography",
  },
  {
    quote: site.statements.distance,
    source: "VOBI's own broadcast descriptions",
  },
];

export function AboutTheMinistry() {
  return (
    <section className="border-b border-line bg-paper-dim py-20 md:py-28">
      <div className="shell">
        <SectionHead
          eyebrow="About the ministry"
          title={
            <>
              What VOBI stands on.
            </>
          }
          aside={
            <p className="max-w-md text-[15px] leading-relaxed text-muted">
              This is what the ministry says of itself — and the part of its history that can
              be dated. Nothing here is invented.
            </p>
          }
        />

        <div className="mt-14 grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="reveal space-y-6 text-[15px] leading-relaxed text-muted lg:col-span-7 md:text-base">
            <p>
              The oldest service on VOBI&apos;s official channel is dated Sunday 8 May 2016. From
              there the public record runs continuously: Mass Prayer gatherings that began in
              2017, a channel that opened to the world in February 2019, outreach into Botswana
              and Zambia, an annual Candle Light Crossover service, and more than eight hundred
              videos published to this day.
            </p>
            <p>
              The ministry introduces every Sunday broadcast the same way — welcoming viewers
              around the globe into the service in the presence of God Almighty. Teaching is
              preached from Scripture by Prophet Promise, and the meetings are not hurried:
              recent Sunday broadcasts have run past seven hours.
            </p>
            <p>
              Where VOBI has not published something — a founding date, a founder&apos;s story, a
              building&apos;s history — this site says so plainly rather than filling the space
              with a guess. Each becomes part of the record the moment the ministry supplies it.
            </p>

            <div className="flex flex-wrap gap-3 pt-2">
              <Link href="/about" className="btn btn-ink">
                About VOBI
              </Link>
              <Link href="/about/story" className="btn btn-ghost text-ink">
                Our story
              </Link>
              <Link href="/about/leadership" className="btn btn-ghost text-ink">
                Leadership
              </Link>
            </div>
          </div>

          <aside className="reveal lg:col-span-5">
            <p className="eyebrow text-muted-light">In the ministry&apos;s own words</p>
            <ul className="mt-6 space-y-px border border-line bg-line">
              {foundations.map((f) => (
                <li key={f.source} className="bg-paper-dim px-7 py-8">
                  <p className="font-display text-[1.35rem] leading-[1.25] tracking-[-0.02em] text-ink">
                    &ldquo;{f.quote}&rdquo;
                  </p>
                  <p className="mt-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-light">
                    {f.source}
                  </p>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </div>
    </section>
  );
}