import Link from "next/link";

import { Countdown } from "@/components/ui/Countdown";
import { site } from "@/config/site";
import type { Sermon } from "@/types";

export function EventCards({ latest }: { latest?: Sermon }) {
  return (
    <section className="gold-wash py-14 md:py-20">
      <div className="shell grid gap-6 md:grid-cols-2">
        <div className="reveal rounded bg-white p-8 text-center text-ink shadow-lg">
          <p className="text-sm font-semibold uppercase tracking-[0.1em] text-muted">Next service</p>
          <h2 className="mt-3 text-2xl font-extrabold uppercase">Sunday Service</h2>
          <p className="mt-1 text-muted">{site.service.day}, {site.service.time} · {site.city}</p>
          <div className="mt-6 flex justify-center"><Countdown variant="card" /></div>
        </div>
        <div className="reveal rounded bg-white p-8 text-center text-ink shadow-lg">
          <p className="text-sm font-semibold uppercase tracking-[0.1em] text-muted">Latest service</p>
          <h2 className="mt-3 text-2xl font-extrabold uppercase">{latest?.title ?? "Sunday Service"}</h2>
          {latest && <p className="mt-1 text-muted">{new Date(latest.date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</p>}
          <Link href={latest ? `/sermons/${latest.slug}` : "/sermons"} className="btn btn-ink mt-8">Watch now</Link>
        </div>
      </div>
    </section>
  );
}
