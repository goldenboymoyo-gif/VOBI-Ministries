import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";

import { Masthead } from "@/components/ui/Masthead";
import { getMinistries, getMinistry } from "@/lib/data";
import { seedMinistries } from "@/content/ministries";

type Params = { slug: string };

export async function generateStaticParams(): Promise<Params[]> {
  return seedMinistries.map((m) => ({ slug: m.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const ministry = await getMinistry(slug);
  if (!ministry) return { title: "Ministry" };

  return {
    title: ministry.name,
    description: ministry.summary,
    alternates: { canonical: `/ministries/${ministry.slug}` },
    openGraph: {
      title: `${ministry.name} — VOBI`,
      description: ministry.summary,
      images: [{ url: ministry.image }],
    },
  };
}

export default async function MinistryPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const ministry = await getMinistry(slug);
  if (!ministry) notFound();

  const all = await getMinistries();
  const others = all.filter((m) => m.slug !== ministry.slug);

  return (
    <>
      <Masthead image="/photos/worship.jpg"
        eyebrow="Ministries"
        crumbs={[
          { label: "Home", href: "/" },
          { label: "Ministries", href: "/ministries" },
          { label: ministry.name },
        ]}
        title={ministry.name}
        intro={ministry.summary}
        meta={
          ministry.gathering ? (
            <p className="border-l-2 border-gold-bright pl-4 text-[14px] leading-relaxed text-paper/85">
              {ministry.gathering}
            </p>
          ) : undefined
        }
      />

      <section className="border-b border-line bg-paper py-20 md:py-28">
        <div className="shell grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="reveal lg:col-span-7">
            <div className="space-y-6 text-[15px] leading-relaxed text-muted md:text-base">
              {ministry.body.map((p, i) => (
                <p key={i} className={i === 0 ? "font-display text-[clamp(1.3rem,2.2vw,1.8rem)] leading-[1.28] tracking-[-0.02em] text-ink" : ""}>
                  {p}
                </p>
              ))}
            </div>

            <div className="mt-10 flex flex-wrap gap-3">
              <Link href="/live" className="btn btn-ink">
                Watch live
              </Link>
              <Link href="/contact" className="btn btn-ghost text-ink">
                Ask about this ministry
              </Link>
            </div>
          </div>

          <div className="reveal lg:col-span-5">
            <div className="frame aspect-[4/3]">
              <Image
                src={ministry.image}
                alt={ministry.name}
                width={800}
                height={600}
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover"
              />
            </div>

            <div className="mt-8 border-t border-line pt-6">
              <p className="eyebrow text-muted-light">Other ministries</p>
              <ul className="mt-5 space-y-3">
                {others.map((o) => (
                  <li key={o.id}>
                    <Link
                      href={`/ministries/${o.slug}`}
                      className="link-underline text-[15px] text-ink"
                    >
                      {o.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
