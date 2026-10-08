import type { Metadata } from "next";
import Link from "next/link";
import { Masthead } from "@/components/ui/Masthead";
import Image from "next/image";

import { getSermons } from "@/lib/data";
import { channelUrl } from "@/content/sermons";
import { socialLinks } from "@/config/socialLinks";
import { site } from "@/config/site";
import { SocialLinks } from "@/components/ui/SocialLinks";
import { thumb } from "@/lib/media";

export const metadata: Metadata = {
  title: "Watch Live",
  description: `Watch Valley of Blessings International Ministries live from ${site.city}, Zimbabwe — services, mass prayer and teaching with Prophet Promise on VOBI's official channel.`,
  alternates: { canonical: "/live" },
};

function videoId(url: string) {
  return url.match(/[?&]v=([\w-]{6,})/)?.[1] ?? null;
}

export default async function LivePage() {
  const sermons = await getSermons();
  const latest = sermons.find((s) => s.category === "service") ?? sermons[0];
  const recent = sermons.filter((s) => s.slug !== latest?.slug).slice(0, 6);
  const id = latest ? videoId(latest.youtubeUrl) : null;

  return (
    <>
      <Masthead
        image="/photos/congregation.jpg"
        eyebrow="Live from Victoria Falls"
        title="Watch the service"
        intro={site.statements.welcome}
        meta={
          <div className="flex flex-wrap gap-3">
            <a href={channelUrl} target="_blank" rel="noopener noreferrer" className="btn btn-gold">Open the channel</a>
            <Link href="/visit" className="btn btn-ghost">Visit in person</Link>
          </div>
        }
      />

      <section className="bg-ink pb-6 pt-10 text-paper">
        <div className="shell-narrow">
          <div className="relative aspect-video w-full overflow-hidden border border-line-dark bg-black">
            {id ? (
              <iframe
                className="absolute inset-0 h-full w-full border-0"
                src={`https://www.youtube-nocookie.com/embed/${id}?rel=0&modestbranding=1&autoplay=0`}
                title={latest?.title ?? "VOBI live service"}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <Image
                src={thumb("zS8NL8NMNlQ")}
                alt="VOBI service"
                fill
                className="object-cover"
                sizes="100vw"
              />
            )}
          </div>
          <div className="mt-6 flex flex-wrap items-baseline justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-paper/45">
                Most recent broadcast
              </p>
              <p className="mt-2 font-display text-[1.35rem] leading-[1.2] tracking-[-0.02em]">
                {latest?.title}
              </p>
            </div>
            <SocialLinks links={socialLinks} tone="reverse" showLabel />
          </div>
        </div>
      </section>

      <section className="border-b border-line bg-paper py-20 md:py-24">
        <div className="shell">
          <p className="eyebrow text-gold">Recent broadcasts</p>
          <ul className="mt-8 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {recent.map((s) => (
              <li key={s.id} className="reveal">
                <a
                  href={s.youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block"
                >
                  <span className="frame frame-hover block aspect-video">
                    <Image
                      src={s.thumbnail}
                      alt={s.title}
                      width={640}
                      height={360}
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover"
                    />
                  </span>
                  <span className="mt-4 block font-display text-[1.1rem] leading-[1.2] tracking-[-0.02em] transition-transform duration-500 group-hover:translate-x-1">
                    {s.title}
                  </span>
                  <span className="mt-2 block text-[12px] text-muted">
                    {new Date(`${s.date}T12:00:00Z`).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                      timeZone: "UTC",
                    })}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
