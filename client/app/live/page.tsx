import type { Metadata } from "next";
import Link from "next/link";

import { Masthead } from "@/components/ui/Masthead";
import { LiveGate } from "@/components/sections/LiveGate";
import { MessageGrid } from "@/components/sections/MessageGrid";
import { getSermons, sortByDateDesc } from "@/lib/data";

export const metadata: Metadata = {
  title: "Watch Live",
  description: "Join the VOBI Sunday service live from Victoria Falls.",
  alternates: { canonical: "/live" },
};

export default async function LivePage() {
  const services = sortByDateDesc(await getSermons()).filter((s) => s.category === "service").slice(0, 6);
  return (
    <>
      <Masthead image="/photos/congregation.jpg" eyebrow="Live from Victoria Falls" title="Live Service"
        intro="Every Sunday the service is live here for the whole world." />
      <section className="gold-wash py-12 md:py-16">
        <div className="shell"><LiveGate /></div>
      </section>
      <section className="bg-paper py-16 md:py-24">
        <div className="shell">
          <h2 className="display-md mb-10">Recent services</h2>
          <MessageGrid items={services} />
          <div className="mt-12"><Link href="/sermons?category=service" className="btn btn-ink">All services</Link></div>
        </div>
      </section>
    </>
  );
}
