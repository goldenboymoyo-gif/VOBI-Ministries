import Link from "next/link";

import { site } from "@/config/site";
import { SectionHead } from "@/components/ui/SectionHead";

const stats = [
  { value: "882", label: "Published videos on the official channel" },
  { value: "9,516", label: "Followers on the official Facebook page" },
  { value: "2019", label: "Year the ministry's channel went online" },
  { value: "4", label: "Verified official channels" },
];

export function AboutIntro() {
  return (
    <section className="relative overflow-hidden bg-ink text-paper">
      <div className="shell py-20 md:py-28">
        <SectionHead
          index="02"
          eyebrow="This is VOBI"
          title={
            <>
              A church in
              <br />
              Victoria Falls,
              <br />
              <em className="not-italic text-gold-bright">heard across</em>
              <br />
              the world.
            </>
          }
          tone="reverse"
        />

        <div className="mt-14 grid gap-12 lg:grid-cols-12">
          <div className="reveal space-y-6 text-[15px] leading-relaxed text-paper/70 lg:col-span-6 lg:text-base">
            <p>
              {site.fullName} gathers in {site.city}, {site.country}, under the ministry of
              Prophet Promise. The address published for the church is {site.address}, in the
              Mkhosana suburb of Victoria Falls.
            </p>
            <p>
              Every Sunday service, mass prayer and teaching is streamed live on the ministry&apos;s
              own channels — so a congregation in Victoria Falls and a viewer thousands of
              kilometres away are watching the same meeting.
            </p>
            <p className="font-display text-[1.5rem] leading-[1.25] tracking-[-0.02em] text-paper">
              {site.statements.distance}
            </p>
          </div>

          <div className="lg:col-span-6">
            <ul className="grid grid-cols-2 gap-px border border-line-dark bg-line-dark">
              {stats.map((s) => (
                <li key={s.label} className="reveal bg-ink px-5 py-8 md:px-7 md:py-10">
                  <p className="numeral text-[clamp(2rem,4.5vw,3.4rem)] leading-none text-paper">
                    {s.value}
                  </p>
                  <p className="mt-4 text-[12px] leading-snug text-paper/55">{s.label}</p>
                </li>
              ))}
            </ul>
            <div className="reveal mt-8 flex flex-wrap gap-3">
              <Link href="/about" className="btn btn-solid">
                About the ministry
              </Link>
              <Link href="/about/leadership" className="btn btn-ghost">
                Prophet Promise
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
