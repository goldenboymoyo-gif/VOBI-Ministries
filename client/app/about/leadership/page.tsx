import type { Metadata } from "next";

import { Masthead } from "@/components/ui/Masthead";
import { Split } from "@/components/ui/Split";
import { CtaBand } from "@/components/ui/CtaBand";
import { site } from "@/config/site";

export const metadata: Metadata = {
  title: "Prophet Promise",
  description: "Prophet Promise, lead minister of Valley of Blessings International Ministries in Victoria Falls.",
  alternates: { canonical: "/about/leadership" },
};

export default function LeadershipPage() {
  return (
    <>
      <Masthead eyebrow="Our Prophet" title="Prophet Promise" image="/photos/hero.jpg"
        intro="Lead minister, Valley of Blessings International Ministries." crumbs={[{ label: "About", href: "/about" }, { label: "Prophet Promise" }]} />
      <Split image="/photos/hero.jpg" alt="Prophet Promise praying for a member of the congregation" title="A shepherd to the people"
        cta={{ label: "Watch his messages", href: "/sermons" }} cta2={{ label: "Testimonies", href: "/testimonies" }}>
        <p>Prophet Promise leads {site.fullName}. He preaches at every Sunday service, leads mass prayer and ministers to people one by one: laying hands on the sick, praying for the burdened and standing with those who need a breakthrough.</p>
        <p>He opens each Sunday broadcast the same way: &ldquo;{site.statements.welcome}&rdquo;</p>
      </Split>
      <Split dark reverse image="/photos/praise.jpg" alt="Praise in the VOBI service" title="His message"
        cta={{ label: "Latest sermon", href: "/sermons?category=sermon" }}>
        <p>Recent teachings include <em>Power In The Mouth</em> and <em>Calmness Brings Victory Over Temptation</em>. Every message is on the ministry&apos;s channel, free to watch.</p>
      </Split>
      <CtaBand title="Need prayer?" text="Send your request. It is read in private and never published." href="/prayer" label="Send a request" />
    </>
  );
}
