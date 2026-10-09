import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Masthead } from "@/components/ui/Masthead";
import { getSettings } from "@/lib/settings";

type Params = { slug: string };

export async function generateStaticParams(): Promise<Params[]> {
  const s = await getSettings();
  const list = (s.pages ?? []).map((p) => ({ slug: p.slug }));
  return list.length ? list : [{ slug: "page" }];
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const p = (await getSettings()).pages?.find((x) => x.slug === slug);
  return { title: p?.title ?? "VOBI", description: p?.intro };
}

export default async function CustomPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const p = (await getSettings()).pages?.find((x) => x.slug === slug);
  if (!p) notFound();
  return (
    <>
      <Masthead image="/photos/worship.jpg" eyebrow="VOBI" title={p.title} intro={p.intro || undefined} />
      <section className="bg-paper py-14 md:py-20">
        <div className="shell-narrow space-y-5 text-lg leading-relaxed text-muted">
          {p.body.map((t, i) => <p key={i}>{t}</p>)}
        </div>
      </section>
    </>
  );
}
