import type { Metadata } from "next";

import { Masthead } from "@/components/ui/Masthead";
import { CtaBand } from "@/components/ui/CtaBand";
import { site, mapsDirectionsUrl, mapsEmbedUrl } from "@/config/site";

export const metadata: Metadata = {
  title: "Branches",
  description: "Find VOBI in Victoria Falls, Zimbabwe.",
  alternates: { canonical: "/branches" },
};

export default function BranchesPage() {
  return (
    <>
      <Masthead eyebrow="Branches" title="Find VOBI" image="/photos/congregation.jpg" intro="Our church is in Mkhosana, Victoria Falls. Our outreach has reached Botswana and Zambia." />
      <section className="bg-paper py-16 md:py-24">
        <div className="shell grid gap-10 lg:grid-cols-2">
          <div className="reveal">
            <p className="eyebrow text-gold">Headquarters</p>
            <h2 className="display-md mt-3">{site.city}, {site.country}</h2>
            <dl className="mt-8 space-y-5 text-[16px]">
              <div><dt className="font-semibold">Address</dt><dd className="text-muted">{site.address}</dd></div>
              <div><dt className="font-semibold">Service</dt><dd className="text-muted">{site.service.day}s at {site.service.time}</dd></div>
              <div><dt className="font-semibold">Phone</dt><dd className="text-muted">{site.phone}</dd></div>
              <div><dt className="font-semibold">Email</dt><dd className="text-muted">{site.email}</dd></div>
            </dl>
            <a href={mapsDirectionsUrl()} target="_blank" rel="noopener noreferrer" className="btn btn-ink mt-8">Get directions</a>
          </div>
          <div className="reveal frame aspect-[4/3]">
            <iframe src={mapsEmbedUrl()} title="Map to VOBI" className="h-full w-full border-0" loading="lazy" />
          </div>
        </div>
      </section>
      <CtaBand title="Outside Victoria Falls?" text="Watch every service live, wherever you are." href="/live" label="Watch live" />
    </>
  );
}
