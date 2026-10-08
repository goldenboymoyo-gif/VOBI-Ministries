import type { Metadata } from "next";

import { Masthead } from "@/components/ui/Masthead";
import { MessageGrid } from "@/components/sections/MessageGrid";
import { CtaBand } from "@/components/ui/CtaBand";
import { getSermons, sortByDateDesc } from "@/lib/data";

export const metadata: Metadata = {
  title: "Devotionals",
  description: "Start your week with a message from Prophet Promise.",
  alternates: { canonical: "/devotionals" },
};

export default async function DevotionalsPage() {
  const all = sortByDateDesc(await getSermons()).filter((s) => s.category === "sermon" || s.category === "teaching");
  const [lead, ...rest] = all;
  return (
    <>
      <Masthead eyebrow="Devotionals" title="Start with the Word" image="/photos/worship.jpg" intro="One message to carry through your week." />
      {lead && (
        <section className="bg-ink py-16 text-paper md:py-24">
          <div className="shell">
            <p className="eyebrow text-gold-bright">This week&apos;s message</p>
            <h2 className="display-md mt-4 max-w-[20ch]">{lead.title}</h2>
            <p className="mt-4 text-paper/70">Prophet Promise · {new Date(lead.date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</p>
            <a href={`/sermons/${lead.slug}`} className="btn btn-gold mt-8">Watch now</a>
          </div>
        </section>
      )}
      <section className="bg-paper py-16 md:py-24">
        <div className="shell">
          <h2 className="display-md mb-10">More to read and watch</h2>
          <MessageGrid items={rest.slice(0, 6)} />
        </div>
      </section>
      <CtaBand title="Pray with us" text="Send a prayer request. We pray over every one." href="/prayer" label="Send a request" />
    </>
  );
}
