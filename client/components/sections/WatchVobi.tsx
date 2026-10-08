import Link from "next/link";
import Image from "next/image";

import type { Sermon } from "@/types";
import { channelUrl } from "@/content/sermons";
import { thumb } from "@/lib/media";

const tiles = [
  {
    label: "Sunday Services",
    href: "/sermons?category=service",
    image: thumb("zS8NL8NMNlQ"),
    alt: "VOBI Sunday live service",
  },
  {
    label: "Sermons",
    href: "/sermons",
    image: thumb("MIj5Em8soV0"),
    alt: "Sermon by Prophet Promise",
  },
  {
    label: "Prayer",
    href: "/prayer",
    image: thumb("aCLyo-8DdaM"),
    alt: "Mass Prayer at VOBI",
  },
  {
    label: "Testimonies",
    href: "/testimonies",
    image: thumb("RyeE1nU4_Fw"),
    alt: "Testimonies published by VOBI",
  },
];

function fmtDate(iso: string) {
  return new Date(`${iso}T12:00:00Z`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

export function WatchVobi({ services }: { services: Sermon[] }) {
  const latest = services[0];

  return (
    <section className="border-b border-line-dark bg-ink py-20 text-paper md:py-28">
      <div className="shell">
        <div className="reveal flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="eyebrow text-gold-bright">Media</p>
            <h2 className="display-md mt-6 max-w-[16ch]">Watch VOBI</h2>
          </div>
          <p className="max-w-md text-[15px] leading-relaxed text-paper/70">
            Services, sermons, prayer and testimonies from Victoria Falls — carried live and
            published by the ministry on its own channel.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {tiles.map((t) => (
            <Link key={t.label} href={t.href} className="group reveal block">
              <span className="frame frame-hover relative block aspect-video">
                <Image
                  src={t.image}
                  alt={t.alt}
                  width={640}
                  height={360}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 24vw"
                  className="object-cover"
                />
                <span className="absolute inset-0 bg-ink/25 transition-colors duration-500 group-hover:bg-ink/45" />
              </span>
              <span className="mt-4 block text-[15px] font-medium text-paper transition-colors group-hover:text-gold-bright">
                {t.label}
              </span>
            </Link>
          ))}
        </div>

        <div className="reveal mt-12 grid gap-8 border-t border-line-dark pt-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <p className="eyebrow text-paper/50">Latest broadcast</p>
            <p className="display-sm mt-4 max-w-[26ch]">
              {latest?.title ?? "The next broadcast will appear here."}
            </p>
            {latest && (
              <p className="mt-3 text-[13px] text-paper/60">
                {fmtDate(latest.date)} · {latest.speaker}
              </p>
            )}
          </div>
          <div className="flex flex-wrap items-start gap-3 lg:col-span-5 lg:justify-end">
            <Link href="/live" className="btn btn-gold">
              Watch live
            </Link>
            <Link href="/media" className="btn btn-ghost">
              All media
            </Link>
            <a
              href={channelUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-ghost"
            >
              Official channel
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
