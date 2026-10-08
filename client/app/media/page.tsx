import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

import { Masthead } from "@/components/ui/Masthead";
import { getSermons } from "@/lib/data";
import { channelUrl } from "@/content/sermons";

export const metadata: Metadata = {
  title: "Media",
  description:
    "Watch Valley of Blessings International Ministries — Sunday services, sermons, prayer and testimonies published by the ministry from Victoria Falls, Zimbabwe.",
  alternates: { canonical: "/media" },
};

const channels = [
  {
    label: "Watch live",
    href: "/live",
    body: "The service in progress, streamed from Victoria Falls.",
  },
  {
    label: "Sunday services",
    href: "/sermons?category=service",
    body: "Full Sunday broadcasts, published by the ministry as they air.",
  },
  {
    label: "Sermons & teachings",
    href: "/sermons",
    body: "Messages ministered by Prophet Promise, indexed by the ministry's own categories.",
  },
  {
    label: "Testimonies",
    href: "/testimonies",
    body: "Videos published by VOBI, in the words of the people who lived them.",
  },
];

export default async function MediaPage() {
  const sermons = await getSermons();
  const services = sermons.filter((s) => s.category === "service");
  const latest = services[0] ?? sermons[0];

  return (
    <>
      <Masthead image="/photos/praise.jpg"
        eyebrow="VOBI TV"
        crumbs={[{ label: "Home", href: "/" }, { label: "Media" }]}
        title="Watch VOBI TV"
        intro="Services, sermons, prayer and testimonies from Victoria Falls."
        meta={
          latest && (
            <div>
              <p className="eyebrow text-paper/45">Latest broadcast</p>
              <p className="mt-4 font-display text-[1.35rem] leading-[1.25] tracking-[-0.02em] text-paper">
                {latest.title}
              </p>
            </div>
          )
        }
      />

      <section className="border-b border-line bg-paper py-20 md:py-28">
        <div className="shell">
          <div className="grid gap-px border border-line bg-line sm:grid-cols-2">
            {channels.map((c) => (
              <div key={c.href} className="reveal bg-paper px-7 py-9 md:px-9 md:py-11">
                <h2 className="display-sm">{c.label}</h2>
                <p className="mt-4 max-w-sm text-[14.5px] leading-relaxed text-muted">
                  {c.body}
                </p>
                <div className="mt-7">
                  <Link href={c.href} className="btn btn-ink">
                    Open
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="reveal mt-14 grid gap-10 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-7">
              {latest && (
                <Link
                  href={`/sermons/${latest.slug}`}
                  className="group block frame frame-hover aspect-video"
                >
                  <Image
                    src={latest.thumbnail}
                    alt={latest.title}
                    width={1280}
                    height={720}
                    sizes="(max-width: 1024px) 100vw, 56vw"
                    className="object-cover"
                  />
                </Link>
              )}
              <p className="mt-4 text-[12px] text-muted-light">
                Our latest broadcast.
              </p>
            </div>

            <div className="lg:col-span-5">
              <p className="eyebrow text-gold">Official channel</p>
              <p className="mt-6 text-[15px] leading-relaxed text-muted">
                VOBI publishes every service, sermon and testimony on its official YouTube
                channel — 882 videos to date. Subscribing there is the surest way to be told
                when the next broadcast begins.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href={channelUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-ink"
                >
                  Official channel
                </a>
                <Link href="/live" className="btn btn-ghost text-ink">
                  Watch live
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
