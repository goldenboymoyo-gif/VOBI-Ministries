import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { HoverPreview } from "@/components/ui/HoverPreview";

import { getSermon, getSermons } from "@/lib/data";
import { seedSermons, seedServices, sermonCategories } from "@/content/sermons";
import { VideoPlayer } from "@/components/ui/VideoPlayer";
import { SectionHead } from "@/components/ui/SectionHead";

type Params = { slug: string };

function videoId(url: string): string | null {
  const m = url.match(/[?&]v=([\w-]{6,})/) ?? url.match(/youtu\.be\/([\w-]{6,})/);
  return m?.[1] ?? null;
}

function fmtDate(iso: string) {
  return new Date(`${iso}T12:00:00Z`).toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

export async function generateStaticParams(): Promise<Params[]> {
  return [...seedSermons, ...seedServices].map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const sermon = await getSermon(slug);
  if (!sermon) return { title: "Message" };

  return {
    title: sermon.title,
    description: sermon.description
      ? sermon.description.slice(0, 180)
      : `${sermon.title} — ministered by ${sermon.speaker} at ${fmtDate(sermon.date)}.`,
    alternates: { canonical: `/sermons/${sermon.slug}` },
    openGraph: {
      title: `${sermon.title} — VOBI`,
      description: `${sermon.title} — ${sermon.speaker}`,
      images: [{ url: sermon.thumbnail }],
    },
  };
}

export default async function SermonPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const sermon = await getSermon(slug);
  if (!sermon) notFound();

  const all = await getSermons();
  const idx = all.findIndex((s) => s.slug === sermon.slug);
  const prev = idx > 0 ? all[idx - 1] : undefined;
  const next = idx >= 0 && idx < all.length - 1 ? all[idx + 1] : undefined;
  const related = all
    .filter((s) => s.slug !== sermon.slug && s.category === sermon.category)
    .slice(0, 3);
  const id = videoId(sermon.youtubeUrl);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: sermon.title,
    description: sermon.description ?? sermon.title,
    uploadDate: sermon.date,
    thumbnailUrl: sermon.thumbnail,
    contentUrl: sermon.youtubeUrl,
    publisher: { "@type": "Organization", name: "Valley of Blessings International Ministries" },
  };

  const dur = sermon.durationSeconds;
  const durText = dur
    ? `${Math.floor(dur / 3600)}h ${Math.floor((dur % 3600) / 60)}m`
    : null;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <header className="relative overflow-hidden bg-ink text-paper">
        <div className="shell pb-14 pt-32 md:pb-16 md:pt-44">
          <nav aria-label="Breadcrumb" className="mb-8 flex flex-wrap items-center gap-2 text-sm font-semibold text-paper/45">
            <Link href="/" className="transition-colors hover:text-paper">Home</Link>
            <span aria-hidden className="opacity-40">/</span>
            <Link href="/sermons" className="transition-colors hover:text-paper">Sermons</Link>
            <span aria-hidden className="opacity-40">/</span>
            <span className="text-paper/80">
              {sermonCategories.find((c) => c.key === sermon.category)?.label}
            </span>
          </nav>

          <p className="eyebrow text-gold-bright">{fmtDate(sermon.date)}</p>
          <h1 className="display-lg mt-6 max-w-[18ch]">{sermon.title}</h1>

          <dl className="mt-8 flex flex-wrap gap-x-10 gap-y-5">
            {[
              { k: "Ministered by", v: sermon.speaker },
              { k: "Category", v: sermonCategories.find((c) => c.key === sermon.category)?.label ?? "—" },
              ...(durText ? [{ k: "Length", v: durText }] : []),
              ...(sermon.views ? [{ k: "Views", v: sermon.views.toLocaleString("en-GB") }] : []),
            ].map((r) => (
              <div key={r.k}>
                <dt className="text-sm font-semibold text-paper/45">
                  {r.k}
                </dt>
                <dd className="mt-1.5 text-[15px] text-paper/85">{r.v}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="h-px w-full bg-line-dark" />
      </header>

      <section className="bg-ink pb-20 text-paper">
        <div className="shell-narrow">
          {id ? (
            <VideoPlayer id={id} title={sermon.title} poster={sermon.thumbnail} next={next ? { title: next.title, href: `/sermons/${next.slug}` } : undefined} />
          ) : (
            <div className="relative aspect-video w-full bg-black"><Image src={sermon.thumbnail} alt={sermon.title} fill className="object-cover" sizes="100vw" /></div>
          )}

          {sermon.description && (
            <p className="mt-8 max-w-3xl text-[15px] leading-relaxed text-paper/70">
              {sermon.description}
            </p>
          )}

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/sermons" className="btn btn-ghost">
              Back to library
            </Link>
          </div>

          <nav className="mt-14 grid gap-px border border-line-dark bg-line-dark sm:grid-cols-2" aria-label="Message navigation">
            {prev ? (
              <Link href={`/sermons/${prev.slug}`} className="group bg-ink px-6 py-7">
                <span className="text-sm font-semibold text-paper/45">Previous</span>
                <span className="mt-3 block display-sm transition-transform duration-500 group-hover:-translate-x-1">
                  {prev.title}
                </span>
              </Link>
            ) : (
              <span className="bg-ink px-6 py-7 opacity-40">
                <span className="text-sm font-semibold text-paper/45">Previous</span>
                <span className="mt-3 block display-sm">Start of the library</span>
              </span>
            )}
            {next ? (
              <Link href={`/sermons/${next.slug}`} className="group bg-ink px-6 py-7 text-right sm:text-right">
                <span className="text-sm font-semibold text-paper/45">Next</span>
                <span className="mt-3 block display-sm transition-transform duration-500 group-hover:translate-x-1">
                  {next.title}
                </span>
              </Link>
            ) : (
              <span className="bg-ink px-6 py-7 text-right opacity-40">
                <span className="text-sm font-semibold text-paper/45">Next</span>
                <span className="mt-3 block display-sm">End of the library</span>
              </span>
            )}
          </nav>
        </div>
      </section>

      {related.length > 0 && (
        <section className="bg-paper py-16 md:py-24">
          <div className="shell">
            <SectionHead index="—" eyebrow="More like this" title={<>Keep going.</>} />
            <ul className="mt-10 grid gap-6 sm:grid-cols-3">
              {related.map((r) => (
                <li key={r.id}>
                  <Link href={`/sermons/${r.slug}`} className="group block">
                    <HoverPreview thumb={r.thumbnail} className="frame aspect-video">
                      <Image
                        src={r.thumbnail}
                        alt={r.title}
                        width={640}
                        height={360}
                        sizes="(max-width: 640px) 100vw, 33vw"
                        className="object-cover"
                      />
                    </HoverPreview>
                    <span className="mt-4 block font-display text-[1.1rem] leading-[1.2] tracking-[-0.02em] transition-transform duration-500 group-hover:translate-x-1">
                      {r.title}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </>
  );
}
