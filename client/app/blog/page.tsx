import type { Metadata } from "next";

import { Masthead } from "@/components/ui/Masthead";
import { MessageGrid } from "@/components/sections/MessageGrid";
import { CtaBand } from "@/components/ui/CtaBand";
import { getSermons, sortByDateDesc } from "@/lib/data";

export const metadata: Metadata = {
  title: "Blog",
  description: "The latest messages and teachings from Prophet Promise at VOBI.",
  alternates: { canonical: "/blog" },
};

export default async function BlogPage() {
  const all = sortByDateDesc(await getSermons());
  const items = all.filter((s) => s.category === "sermon" || s.category === "teaching").slice(0, 12);
  return (
    <>
      <Masthead eyebrow="Our blog" title="Latest messages" image="/photos/praise.jpg" intro="Teaching from Prophet Promise. Watch, then share with someone who needs it." />
      <section className="bg-paper py-16 md:py-24"><div className="shell"><MessageGrid items={items} /></div></section>
      <CtaBand title="Want more?" text="Every sermon and service is on VOBI TV." href="/sermons" label="Browse VOBI TV" />
    </>
  );
}
