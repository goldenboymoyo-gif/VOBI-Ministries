import Link from "next/link";
import Image from "next/image";

import type { Sermon } from "@/types";
import { HoverPreview } from "@/components/ui/HoverPreview";

const pills = [
  { h: "sermons", l: "Sermons" },
  { h: "testimony", l: "Testimonies" },
  { h: "prophecy", l: "Prophecy" },
  { h: "massprayer", l: "Mass Prayer" },
  { h: "funny", l: "Funny Moments" },
];

function fmtDate(iso: string) {
  return new Date(`${iso}T12:00:00Z`).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
}

export function Word({ latest, total }: { latest?: Sermon; total: number }) {
  return (
    <section className="bg-ink py-20 text-white md:py-28">
      <div className="shell grid items-center gap-10 lg:grid-cols-12 lg:gap-14">
        <div className="lg:col-span-5">
          <p className="eyebrow text-gold-bright">VOBI TV</p>
          <h2 className="mt-3 text-3xl font-extrabold uppercase leading-tight md:text-4xl">Hear the Word this week</h2>
          <p className="mt-5 text-lg leading-relaxed text-white/75">
            {latest ? <>Latest message: <span className="font-semibold text-white">{latest.title}</span>{latest.date ? `, ${fmtDate(latest.date)}` : ""}.</> : "The next message will appear here."}
          </p>
          <p className="mt-3 text-sm text-white/55">{total} messages and services to watch, any time.</p>
          <div className="mt-6 flex flex-wrap gap-2">
            {pills.map((p) => (
              <Link key={p.h} href={`/sermons#${p.h}`} className="rounded-full border border-white/25 px-4 py-2 text-sm font-semibold text-white transition-colors hover:border-gold-bright hover:bg-gold-bright hover:text-ink">{p.l}</Link>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href={latest ? `/sermons/${latest.slug}` : "/sermons"} className="btn btn-gold">Watch the message</Link>
            <Link href="/sermons" className="btn btn-ghost text-white">Open VOBI TV</Link>
          </div>
        </div>
        <div className="lg:col-span-7">
          <Link href={latest ? `/sermons/${latest.slug}` : "/sermons"} className="group block">
            <HoverPreview thumb={latest?.thumbnail ?? ""} className="aspect-video bg-black shadow-2xl">
              {latest && <Image src={latest.thumbnail} alt={latest.title} width={1280} height={720} sizes="(max-width: 1024px) 100vw, 58vw" className="h-full w-full object-cover" />}
            </HoverPreview>
          </Link>
        </div>
      </div>
    </section>
  );
}
