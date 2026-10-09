import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Masthead } from "@/components/ui/Masthead";
import { VideoPlayer } from "@/components/ui/VideoPlayer";
import { Engage } from "@/components/ui/Engage";
import { getTestimonies } from "@/lib/data";
import { seedTestimonies } from "@/content/testimonies";

type Params = { slug: string };

function videoId(url: string): string | null {
  const m = url.match(/[?&]v=([\w-]{6,})/) ?? url.match(/youtu\.be\/([\w-]{6,})/);
  return m?.[1] ?? null;
}

export async function generateStaticParams(): Promise<Params[]> {
  return seedTestimonies.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const t = (await getTestimonies()).find((x) => x.slug === slug);
  return { title: t?.title ?? "Testimony" };
}

export default async function TestimonyPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const t = (await getTestimonies()).find((x) => x.slug === slug);
  if (!t) notFound();
  const id = videoId(t.youtubeUrl);
  return (
    <>
      <Masthead image="/photos/worship.jpg" eyebrow="Testimony" title={t.title}
        crumbs={[{ label: "Home", href: "/" }, { label: "Testimonies", href: "/testimonies" }, { label: "Watch" }]} />
      <section className="gold-wash py-12 md:py-16">
        <div className="shell-narrow">
          {id && <VideoPlayer id={id} title={t.title} poster={t.thumbnail} />}
          {id && <Engage videoId={id} className="mt-8" />}
          <div className="mt-8"><Link href="/testimonies" className="btn btn-ink">More testimonies</Link></div>
        </div>
      </section>
    </>
  );
}
