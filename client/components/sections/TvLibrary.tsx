"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import { HoverPreview } from "@/components/ui/HoverPreview";

export type TvCard = { key: string; title: string; thumb: string; href: string; cat: string; label: string };

const TABS = [
  { k: "all", l: "All" },
  { k: "sermons", l: "Sermons" },
  { k: "testimony", l: "Testimony" },
  { k: "prophecy", l: "Prophecy" },
  { k: "massprayer", l: "Mass Prayer" },
  { k: "praise", l: "Praise & Worship" },
  { k: "funny", l: "Funny Moments" },
];

export function TvLibrary({ items }: { items: TvCard[] }) {
  const [tab, setTab] = useState("all");
  const [shown, setShown] = useState(12);
  useEffect(() => {
    const read = () => { const h = window.location.hash.slice(1); if (TABS.some((t) => t.k === h)) { setTab(h); setShown(12); } };
    read();
    window.addEventListener("hashchange", read);
    return () => window.removeEventListener("hashchange", read);
  }, []);
  const list = tab === "all" ? items : items.filter((i) => i.cat === tab);

  return (
    <>
      <div className="flex flex-wrap gap-2 border-b border-line pb-6" role="tablist" aria-label="VOBI TV categories">
        {TABS.map((t) => (
          <button key={t.k} role="tab" aria-selected={tab === t.k} type="button"
            onClick={() => { setTab(t.k); setShown(12); }}
            className={`rounded px-5 py-2.5 text-sm font-bold transition-colors ${tab === t.k ? "bg-ink text-white" : "bg-white text-ink shadow-sm hover:bg-gold-bright"}`}>
            {t.l}
          </button>
        ))}
        <Link href="/live" className="inline-flex items-center gap-2 rounded bg-red-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-red-700">
          <span className="h-2 w-2 rounded-full bg-white" /> Watch Live
        </Link>
      </div>

      <ul className="mt-10 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
        {list.slice(0, shown).map((i) => (
          <li key={i.key}>
            <Link href={i.href} className="group block">
              <HoverPreview thumb={i.thumb} className="frame aspect-video">
                <Image src={i.thumb} alt={i.title} width={640} height={360} unoptimized={i.thumb.startsWith("http") || i.thumb.startsWith("/api/")}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover" />
              </HoverPreview>
              <span className="mt-3 block text-sm italic text-gold">{i.label}</span>
              <span className="mt-1 block text-lg font-bold leading-snug transition-colors group-hover:text-gold">{i.title}</span>
            </Link>
          </li>
        ))}
      </ul>
      {list.length === 0 && <p className="mt-10 text-muted">Nothing here yet.</p>}
      {shown < list.length && (
        <div className="mt-12 text-center">
          <button type="button" onClick={() => setShown(shown + 12)} className="btn btn-ink">Show more</button>
        </div>
      )}
    </>
  );
}
