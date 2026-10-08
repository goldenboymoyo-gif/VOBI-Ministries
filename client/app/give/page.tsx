import type { Metadata } from "next";

import { Masthead } from "@/components/ui/Masthead";
import { Split } from "@/components/ui/Split";
import { site } from "@/config/site";

export const metadata: Metadata = {
  title: "Give & Partner",
  description: "Give to the work of Valley of Blessings International Ministries.",
  alternates: { canonical: "/give" },
};

export default function GivePage() {
  return (
    <>
      <Masthead eyebrow="Give & partner" title="Sow into the work" image="/photos/worship.jpg" intro="Your giving carries the service, the outreach and the broadcast to people who need it." />
      <Split image="/photos/praise.jpg" alt="Worship at VOBI" title="Where giving goes">
        <p>VOBI&apos;s work includes the Sunday service and its live broadcast, mass prayer, humanitarian outreach and trips into Botswana and Zambia.</p>
        <p>To give or become a partner, contact the ministry directly. We will tell you the ways to give.</p>
      </Split>
      <section className="bg-ink py-16 text-paper md:py-20">
        <div className="shell flex flex-wrap items-center gap-4">
          <a href={`tel:${site.phone.replace(/\s+/g, "")}`} className="btn btn-gold">Call {site.phone}</a>
          <a href={`mailto:${site.email}`} className="btn btn-ghost">Email us</a>
        </div>
      </section>
    </>
  );
}
