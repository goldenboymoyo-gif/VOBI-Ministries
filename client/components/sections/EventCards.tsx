import Link from "next/link";

import { Countdown } from "@/components/ui/Countdown";
import { site } from "@/config/site";
import type { Sermon } from "@/types";

export function EventCards({ latest }: { latest?: Sermon }) {
  return (
    <section className="gold-wash py-14 md:py-20">
      <div className="shell grid gap-5 md:grid-cols-2 md:gap-6">
        <div className="reveal overflow-hidden rounded-2xl bg-white px-4 py-7 text-center sm:p-8 text-ink shadow-lg">
          <p className="text-sm font-semibold uppercase tracking-[0.1em] text-muted">Next service</p>
          <h2 className="mt-3 break-words text-xl font-extrabold uppercase sm:text-2xl">Sunday Service</h2>
          <p className="mt-1 text-muted">{site.service.day}, {site.service.time} · {site.city}</p>
          <div className="mx-auto mt-6 w-full max-w-sm"><Countdown variant="card" /></div>
        </div>
        <div className="reveal overflow-hidden rounded-2xl bg-white px-4 py-7 text-center sm:p-8 text-ink shadow-lg">
          <p className="text-sm font-semibold uppercase tracking-[0.1em] text-muted">Latest service</p>
          <h2 className="mt-3 break-words text-xl font-extrabold uppercase sm:text-2xl">{latest?.title ?? "Sunday Service"}</h2>
          {latest && <p className="mt-1 text-muted">{new Date(latest.date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</p>}
          <Link href={latest ? `/sermons/${latest.slug}` : "/sermons"} className="btn btn-ink mt-6 sm:mt-8">Watch now</Link>
        </div>
      </div>
    </section>
  );
}
