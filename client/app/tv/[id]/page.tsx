import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Masthead } from "@/components/ui/Masthead";
import { VideoPlayer } from "@/components/ui/VideoPlayer";
import { Engage } from "@/components/ui/Engage";
import { tvItems, tvLabels } from "@/content/vobitv";
import { thumb } from "@/lib/media";
import { getSettings } from "@/lib/settings";

type Item = { id: string; title: string; cat: string; src?: string; poster?: string };
async function allItems(): Promise<Item[]> {
  const s = await getSettings();
  const hidden = new Set(s.hiddenVideos ?? []);
  return [...(s.videos ?? []), ...(s.imported ?? []).filter((t) => !hidden.has(t.id)), ...tvItems.filter((t) => !hidden.has(t.id))];
}

type Params = { id: string };

export async function generateStaticParams(): Promise<Params[]> {
  return tvItems.map((i) => ({ id: i.id }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { id } = await params;
  return { title: (await allItems()).find((i) => i.id === id)?.title ?? "VOBI TV" };
}

export default async function TvPage({ params }: { params: Promise<Params> }) {
  const { id } = await params;
  const items = await allItems();
  const item = items.find((i) => i.id === id);
  if (!item) notFound();
  const same = items.filter((i) => i.cat === item.cat);
  const n = same[same.findIndex((i) => i.id === item.id) + 1];
  return (
    <>
      <Masthead image="/photos/worship.jpg" eyebrow={tvLabels[item.cat] ?? "Video"} title={item.title}
        crumbs={[{ label: "VOBI TV", href: "/sermons" }, { label: "Watch" }]} />
      <section className="gold-wash py-12 md:py-16">
        <div className="shell-narrow">
          {item.src ? (
            <video className="aspect-video w-full bg-black" src={item.src} poster={item.poster} controls playsInline preload="metadata" />
          ) : (
          <VideoPlayer id={item.id} title={item.title} poster={thumb(item.id)} next={n ? { title: n.title, href: `/tv/${n.id}` } : undefined} />
          )}
          <Engage videoId={item.id} className="mt-8" />
          <div className="mt-8"><Link href="/sermons" className="btn btn-ink">Back to VOBI TV</Link></div>
        </div>
      </section>
    </>
  );
}
