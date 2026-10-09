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

      <section id="story" className="bg-paper py-16 md:py-24">
        <div className="shell grid gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-36">
              <p className="eyebrow text-gold">Since 2017</p>
              <h2 className="mt-2 text-3xl font-extrabold uppercase md:text-4xl">Our story</h2>
              <p className="mt-4 leading-relaxed text-muted">How VOBI has grown, one season at a time.</p>
            </div>
          </div>
          <ol className="lg:col-span-8">
            {story.map((e, i) => (
              <li key={i} className="grid gap-2 border-b border-line py-7 first:pt-0 md:grid-cols-[6rem_1fr] md:gap-8">
                <p className="text-lg font-bold text-gold">{e.year}</p>
                <div>
                  <h3 className="text-xl font-bold">{e.title}</h3>
                  <p className="mt-2 leading-relaxed text-muted">{e.body}</p>
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
            {beliefs.map((b) => (
              <div key={b.t} className="reveal border-t-4 border-gold-bright bg-white p-8 shadow-md">
                <h3 className="text-xl font-bold">{b.t}</h3>
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
