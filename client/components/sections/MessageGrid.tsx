import Image from "next/image";
import Link from "next/link";
import { HoverPreview } from "@/components/ui/HoverPreview";

import type { Sermon } from "@/types";

export function MessageGrid({ items }: { items: Sermon[] }) {
  return (
    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((s) => (
        <Link key={s.id} href={`/sermons/${s.slug}`} className="group reveal block">
          <HoverPreview thumb={s.thumbnail} className="frame aspect-video">
            <Image src={s.thumbnail} alt={s.title} width={1280} height={720} sizes="(max-width:1024px) 100vw, 33vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105" />
          </HoverPreview>
          <p className="eyebrow mt-4 text-gold">
            {new Date(s.date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
          </p>
          <h3 className="display-sm mt-2 transition-colors group-hover:text-gold">{s.title}</h3>
          <p className="mt-2 text-[15px] text-muted">{s.speaker}</p>
          <span className="mt-3 inline-block text-xs font-semibold uppercase tracking-[0.18em]">Watch →</span>
        </Link>
      ))}
    </div>
  );
}
