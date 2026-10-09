import type { Metadata } from "next";

import { Masthead } from "@/components/ui/Masthead";
import { TvLibrary, type TvCard } from "@/components/sections/TvLibrary";
import { getSermons, sortByDateDesc } from "@/lib/data";
import { tvItems, tvLabels } from "@/content/vobitv";
import { thumb } from "@/lib/media";
import { getSettings } from "@/lib/settings";

export const metadata: Metadata = {
  title: "VOBI TV",
  description: "Sermons, testimonies, prophecy, mass prayer and more from Valley of Blessings International Ministries.",
  alternates: { canonical: "/sermons" },
};

export default async function SermonsPage() {
  const [sermonRows, settings] = await Promise.all([getSermons(), getSettings()]);
  const sermons = sortByDateDesc(sermonRows);
  const cards = new Map<string, TvCard>();
  for (const s of sermons) {
    cards.set(s.id, { key: s.id, title: s.title, thumb: s.thumbnail, href: `/sermons/${s.slug}`, cat: "sermons", label: tvLabels.sermons });
  }
  for (const i of [...(settings.videos ?? []), ...tvItems] as { id: string; title: string; cat: string }[]) {
    if (!cards.has(i.id)) cards.set(i.id, { key: i.id, title: i.title, thumb: thumb(i.id), href: `/tv/${i.id}`, cat: i.cat, label: tvLabels[i.cat] ?? "Video" });
  }
  const items = Array.from(cards.values());
  const mixed = [...items.filter((c) => c.cat === "sermons"), ...items.filter((c) => c.cat !== "sermons")];

  return (
    <>
      <Masthead image="/photos/hero.jpg" eyebrow="VOBI TV" title="Watch VOBI TV" intro="Sermons, testimonies, prophecy, mass prayer and more." />
      <section className="bg-paper py-12 md:py-16">
        <div className="shell"><TvLibrary items={mixed} /></div>
      </section>
    </>
  );
}
