import Link from "next/link";
import Image from "next/image";

import type { Sermon } from "@/types";
import { sermonCategories } from "@/content/sermons";
import { SectionHead } from "@/components/ui/SectionHead";

function fmtDate(iso: string) {
  return new Date(`${iso}T12:00:00Z`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

export function Word({ latest, total }: { latest?: Sermon; total: number }) {
  return (
    <section className="border-b border-line bg-paper py-20 md:py-28">
      <div className="shell">
        <SectionHead
          eyebrow="Sermons"
          title={
            <>
              The Word.
            </>
          }
        />

        <div className="mt-14 grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="reveal lg:col-span-5">
            <ul className="border-t border-line">
              {sermonCategories.map((c) => (
                <li key={c.key}>
                  <Link
                    href={`/sermons?category=${c.key}`}
                    className="group flex items-baseline justify-between gap-6 border-b border-line py-5"
                  >
                    <span className="text-[15px] font-medium">{c.label}</span>
                    <svg
                      viewBox="0 0 24 24"
                      className="h-5 w-5 shrink-0 stroke-current fill-none stroke-[1.5] transition-transform duration-500 group-hover:translate-x-1"
                      aria-hidden
                    >
                      <path d="M4 12h15M13 6l6 6-6 6" />
                    </svg>
                  </Link>
                </li>
              ))}
            </ul>
            <p className="mt-6 text-[13px] leading-relaxed text-muted">
              {total} messages, services and special gatherings on VOBI TV.
            </p>
          </div>

          <div className="reveal lg:col-span-7">
            <p className="eyebrow text-gold">Latest message</p>
            <h3 className="display-md mt-5 max-w-[18ch]">
              {latest?.title ?? "The next message will appear here."}
            </h3>

            <Link
              href={latest ? `/sermons/${latest.slug}` : "/sermons"}
              target={latest ? "_blank" : undefined}
              rel={latest ? "noopener noreferrer" : undefined}
              className="group mt-8 block frame frame-hover aspect-video"
            >
              {latest && (
                <Image
                  src={latest.thumbnail}
                  alt={latest.title}
                  width={1280}
                  height={720}
                  sizes="(max-width: 1024px) 100vw, 54vw"
                  className="object-cover"
                />
              )}
              <span className="absolute inset-0 bg-ink/0 transition-colors duration-500 group-hover:bg-ink/25" />
            </Link>

            <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm font-semibold text-muted">
              <span>{latest ? fmtDate(latest.date) : "—"}</span>
              <span aria-hidden className="opacity-40">
                ·
              </span>
              <span>{latest?.speaker}</span>
              <span aria-hidden className="opacity-40">
                ·
              </span>
              <span className="text-gold">{sermonCategories.find((c) => c.key === latest?.category)?.label}</span>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href={latest ? `/sermons/${latest.slug}` : "/sermons"}
                target={latest ? "_blank" : undefined}
                rel={latest ? "noopener noreferrer" : undefined}
                className="btn btn-gold"
              >
                Watch the message
              </Link>
              <Link href="/sermons" className="btn btn-ghost text-ink">
                Open the library
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
