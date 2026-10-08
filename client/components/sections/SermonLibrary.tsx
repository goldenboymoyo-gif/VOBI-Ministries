"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState, useTransition } from "react";

import type { Sermon } from "@/types";
import { sermonCategories } from "@/content/sermons";

function fmtDate(iso: string) {
  return new Date(`${iso}T12:00:00Z`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

function duration(seconds?: number) {
  if (!seconds) return null;
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  return h ? `${h}h ${m}m` : `${m}m`;
}

export function SermonLibrary({ sermons }: { sermons: Sermon[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const active = searchParams.get("category") ?? "all";
  const [query, setQuery] = useState("");

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: sermons.length };
    for (const s of sermons) c[s.category] = (c[s.category] ?? 0) + 1;
    return c;
  }, [sermons]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return sermons.filter((s) => {
      const inCategory = active === "all" || s.category === active;
      const inQuery = !q || s.title.toLowerCase().includes(q);
      return inCategory && inQuery;
    });
  }, [sermons, active, query]);

  function setCategory(key: string) {
    startTransition(() => {
      router.replace(key === "all" ? "/sermons" : `/sermons?category=${key}`, {
        scroll: false,
      });
    });
  }

  const tabs = [{ key: "all", label: "All" }, ...sermonCategories];

  return (
    <>
      <div className="flex flex-col gap-6 border-b border-line pb-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="flex flex-wrap gap-2" role="tablist" aria-label="Filter by category">
          {tabs.map((t) => {
            const on = active === t.key;
            return (
              <button
                key={t.key}
                type="button"
                role="tab"
                aria-selected={on}
                onClick={() => setCategory(t.key)}
                className={[
                  "border px-4 py-2.5 text-sm font-semibold transition-colors",
                  on
                    ? "border-ink bg-ink text-paper"
                    : "border-line text-muted hover:border-ink hover:text-ink",
                ].join(" ")}
              >
                {t.label}
                <span className="ml-2 opacity-60">{counts[t.key] ?? 0}</span>
              </button>
            );
          })}
        </div>

        <label className="block w-full lg:w-72">
          <span className="sr-only">Search messages</span>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search titles…"
            className="field"
          />
        </label>
      </div>

      <p className="mt-6 text-sm font-semibold text-muted-light">
        {filtered.length} {filtered.length === 1 ? "message" : "messages"}
      </p>

      {filtered.length === 0 ? (
        <div className="mt-8 border border-line px-7 py-14 text-center">
          <p className="display-sm">Nothing matches that yet.</p>
          <p className="mt-4 text-[14px] text-muted">
            Try another word, or clear the category filter.
          </p>
        </div>
      ) : (
        <ul className="mt-8 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((s) => (
            <li key={s.id}>
              <Link
                href={`/sermons/${s.slug}`}
                className="group block"
                aria-label={s.title}
              >
                <span className="frame frame-hover relative block aspect-video">
                  <Image
                    src={s.thumbnail}
                    alt={s.title}
                    width={640}
                    height={360}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover"
                  />
                  <span className="absolute bottom-3 right-3 bg-ink/85 px-2 py-1 text-sm font-semibold text-paper">
                    {duration(s.durationSeconds) ?? "Watch"}
                  </span>
                </span>
                <span className="mt-5 block text-sm font-semibold text-gold">
                  {sermonCategories.find((c) => c.key === s.category)?.label}
                </span>
                <span className="mt-2.5 block font-display text-[1.25rem] leading-[1.15] tracking-[-0.02em] transition-transform duration-500 group-hover:translate-x-1">
                  {s.title}
                </span>
                <span className="mt-3 block text-[12px] text-muted">
                  {fmtDate(s.date)} · {s.speaker}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
