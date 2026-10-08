import type { Metadata } from "next";

import { Masthead } from "@/components/ui/Masthead";
import { Split } from "@/components/ui/Split";
import { CtaBand } from "@/components/ui/CtaBand";
import { site } from "@/config/site";

export const metadata: Metadata = {
  title: "About",
  description: `${site.fullName} — a church in ${site.city}, ${site.country}, led by Prophet Promise.`,
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <>
      <Masthead eyebrow="About" title="The church that Christ built" image="/photos/congregation.jpg"
        intro={`${site.fullName} in ${site.city}, ${site.country}. ${site.statements.bioLine}`} />
      <Split image="/photos/congregation.jpg" alt="The VOBI congregation in worship" title="Valley of Blessings International Ministries"
        cta={{ label: "Our story", href: "/about/story" }} cta2={{ label: "What we believe", href: "/about/what-we-believe" }}>
        <p>VOBI is a church in Mkhosana, Victoria Falls, under the leadership of Prophet Promise. Every Sunday the congregation gathers at {site.service.time} for worship, the Word, prayer and ministry to the sick and the burdened.</p>
        <p>The service is live to the world, so a family in Victoria Falls and a viewer in another country worship together. {site.statements.distance}</p>
      </Split>
      <Split dark reverse image="/photos/hero.jpg" alt="Prophet Promise praying for a member of the congregation" title="Prophet Promise"
        cta={{ label: "Meet the Prophet", href: "/about/leadership" }}>
        <p>Prophet Promise ministers at every Sunday service, mass prayer and deliverance gathering. His messages are published on the ministry&apos;s own channel for anyone to watch.</p>
      </Split>
      <Split image="/photos/praise.jpg" alt="Praise at a VOBI service" title="Come as you are"
        cta={{ label: "Plan your visit", href: "/visit" }}>
        <p>You do not need to be a member or dress a certain way. Come early, bring your family, and expect the service to go on until the Holy Spirit gives the signal to end.</p>
      </Split>
      <CtaBand title="Join us this Sunday" text={`${site.service.day} at ${site.service.time}, ${site.address}.`} href="/visit" label="Get directions" />
    </>
  );
}
