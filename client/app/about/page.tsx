import type { Metadata } from "next";

import { Masthead } from "@/components/ui/Masthead";
import { Split } from "@/components/ui/Split";
import { CtaBand } from "@/components/ui/CtaBand";
import { site } from "@/config/site";
import { story } from "@/content/story";

export const metadata: Metadata = {
  title: "About",
  description: `${site.fullName} — a church in ${site.city}, ${site.country}, led by Prophet Promise.`,
  alternates: { canonical: "/about" },
};

const beliefs = [
  { t: "Salvation in Christ", d: `${site.statements.bioLine} Salvation is God's gift through Jesus Christ.` },
  { t: "The Word of God", d: "Every service is preached from the Scriptures, the final word for faith and life." },
  { t: "The Holy Spirit", d: "The Holy Spirit leads the church. Our services begin at 08:30 and end when He gives the signal." },
  { t: "Prayer", d: "We pray together in mass prayer and on the prayer line, and we believe God answers." },
  { t: "Healing and deliverance", d: "Jesus still heals the sick and sets people free. Testimonies are on VOBI TV." },
  { t: "One church, everywhere", d: `${site.statements.distance} Wherever you watch from, you are part of the service.` },
];

export default function AboutPage() {
  return (
    <>
      <Masthead eyebrow="About" title="The church that Christ built" image="/photos/congregation.jpg"
        intro={`${site.fullName} in ${site.city}, ${site.country}. ${site.statements.bioLine}`} />

      <Split image="/photos/congregation.jpg" alt="The VOBI congregation in worship" title="Who we are"
        cta={{ label: "Plan your visit", href: "/visit" }}>
        <p>VOBI is a church in Mkhosana, Victoria Falls, under the leadership of Prophet Promise. Every Sunday the congregation gathers at {site.service.time} for worship, the Word, prayer and ministry to the sick and the burdened.</p>
        <p>The service is live to the world, so a family in Victoria Falls and a viewer in another country worship together. {site.statements.distance}</p>
      </Split>

      <section id="story" className="bg-ink py-16 text-white md:py-24">
        <div className="shell-narrow">
          <h2 className="display-md">Our story</h2>
          <ol className="mt-10">
            {story.map((e, i) => (
              <li key={i} className="reveal grid gap-3 border-t border-white/15 py-8 md:grid-cols-[9rem_1fr] md:gap-10">
                <p className="text-3xl font-extrabold text-gold-bright">{e.year}</p>
                <div>
                  <h3 className="text-xl font-bold">{e.title}</h3>
                  <p className="mt-2 leading-relaxed text-white/70">{e.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="faith" className="bg-paper py-16 md:py-24">
        <div className="shell">
          <h2 className="display-md">What we believe</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {beliefs.map((b, i) => (
              <div key={b.t} className="reveal rounded bg-white p-8 shadow-md">
                <p className="text-4xl font-extrabold text-gold-bright">0{i + 1}</p>
                <h3 className="mt-3 text-xl font-bold">{b.t}</h3>
                <p className="mt-2 leading-relaxed text-muted">{b.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div id="prophet">
        <Split dark image="/photos/hero.jpg" alt="Prophet Promise praying for a member of the congregation" title="Prophet Promise"
          cta={{ label: "Watch his messages", href: "/sermons" }}>
          <p>Prophet Promise leads {site.fullName}. He preaches at every Sunday service, leads mass prayer and ministers to people one by one: laying hands on the sick, praying for the burdened and standing with those who need a breakthrough.</p>
          <p>He opens each Sunday broadcast the same way: &ldquo;{site.statements.welcome}&rdquo;</p>
        </Split>
      </div>

      <CtaBand title="Join us this Sunday" text={`${site.service.day} at ${site.service.time}, ${site.address}.`} href="/visit" label="Get directions" />
    </>
  );
}
