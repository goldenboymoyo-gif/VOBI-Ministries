import Link from "next/link";
import Image from "next/image";

import type { Testimony } from "@/types";
import { HoverPreview } from "@/components/ui/HoverPreview";

export function Testimonies({ testimonies }: { testimonies: Testimony[] }) {
  const featured = testimonies.slice(0, 3);

  return (
    <section className="gold-wash py-20 md:py-28">
      <div className="shell">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="eyebrow text-ink/70">Testimonies</p>
            <h2 className="mt-2 text-3xl font-extrabold uppercase md:text-4xl">What God has done</h2>
          </div>
          <Link href="/sermons#testimony" className="btn btn-ink">More testimonies</Link>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {featured.map((t) => (
            <Link key={t.id} href={`/testimonies/${t.slug}`} className="group block overflow-hidden bg-white shadow-md transition-shadow hover:shadow-xl">
              <HoverPreview thumb={t.thumbnail} className="aspect-video">
                <Image src={t.thumbnail} alt={t.title} width={640} height={360} sizes="(max-width: 768px) 100vw, 33vw" className="h-full w-full object-cover" />
              </HoverPreview>
              <span className="block p-6">
                <span className="block text-lg font-bold leading-snug">{t.title}</span>
                <span className="mt-2 block text-sm text-muted">
                  {[t.person, t.location].filter(Boolean).join(" · ") || "VOBI Ministries"}
                </span>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
