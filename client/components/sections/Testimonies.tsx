import Link from "next/link";
import Image from "next/image";

import type { Testimony } from "@/types";
import { SectionHead } from "@/components/ui/SectionHead";

export function Testimonies({ testimonies }: { testimonies: Testimony[] }) {
  const featured = testimonies.slice(0, 3);

  return (
    <section className="border-b border-line bg-paper py-20 md:py-28">
      <div className="shell">
        <SectionHead
          eyebrow="Testimonies"
          title={
            <>
              Testimonies.
            </>
          }
          aside={
            <p className="max-w-md text-[15px] leading-relaxed text-muted">
              Real people, real stories. Watch what God has done.</p>
          }
        />

        <div className="mt-14 grid gap-8 md:grid-cols-3 md:gap-6">
          {featured.map((t) => (
            <Link
              key={t.id}
              href={`/testimonies/${t.slug}`}
              className="group reveal block"
            >
              <span className="frame frame-hover relative block aspect-video">
                <Image
                  src={t.thumbnail}
                  alt={t.title}
                  width={640}
                  height={360}
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover"
                />
                <span className="absolute inset-0 grid place-items-center opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                  <span className="grid h-14 w-14 place-items-center rounded-full border border-paper/70 bg-ink/40 backdrop-blur-[2px]">
                    <svg viewBox="0 0 24 24" className="ml-0.5 h-5 w-5 fill-paper" aria-hidden>
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </span>
                </span>
              </span>
              <span className="mt-5 block display-sm transition-transform duration-500 group-hover:translate-x-1">
                {t.title}
              </span>
              <span className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm font-semibold text-muted">
                {t.person && <span>{t.person}</span>}
                {t.location && <span className="text-muted-light">· {t.location}</span>}
                {!t.person && !t.location && <span className="text-gold">VOBI Ministries</span>}
              </span>
            </Link>
          ))}
        </div>

        <div className="reveal mt-12 flex flex-wrap gap-3">
          <Link href="/testimonies" className="btn btn-ink">
            More testimonies
          </Link>
        </div>
      </div>
    </section>
  );
}
