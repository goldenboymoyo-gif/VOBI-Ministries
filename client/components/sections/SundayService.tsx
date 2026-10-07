import Link from "next/link";
import Image from "next/image";

import type { Sermon } from "@/types";
import { SectionHead } from "@/components/ui/SectionHead";
import { ServiceTime } from "@/components/ui/ServiceTime";

function fmtDuration(seconds?: number) {
  if (!seconds) return null;
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  return h ? `${h}h ${m}m` : `${m}m`;
}

function fmtDate(iso: string) {
  return new Date(`${iso}T12:00:00Z`).toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

export function SundayService({ service }: { service?: Sermon }) {
  const duration = fmtDuration(service?.durationSeconds);

  return (
    <section className="relative overflow-hidden border-b border-line bg-paper py-20 md:py-28">
      <div className="shell">
        <SectionHead
          index="01"
          eyebrow="This Sunday"
          title={
            <>
              The latest
              <br />
              live service
            </>
          }
          aside={
            <div className="max-w-md">
              <p className="text-[15px] leading-relaxed text-muted">
                Every service is broadcast from Victoria Falls on the ministry&apos;s official
                channel. Nothing on this page is re-recorded or re-edited — you are watching what
                the congregation saw.
              </p>
              <p className="mt-5 border-l-2 border-gold pl-4 text-[14px] leading-relaxed text-ink">
                <ServiceTime />
              </p>
            </div>
          }
        />

        <div className="mt-14 grid gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="reveal lg:col-span-7">
            <Link
              href={service?.youtubeUrl ?? "/sermons"}
              className="group block frame frame-hover aspect-video"
              target={service ? "_blank" : undefined}
              rel={service ? "noopener noreferrer" : undefined}
            >
              {service && (
                <>
                  <Image
                    src={service.thumbnail}
                    alt={service.title}
                    width={1280}
                    height={720}
                    sizes="(max-width: 1024px) 100vw, 58vw"
                    className="object-cover"
                  />
                  <span className="absolute inset-0 grid place-items-center">
                    <span className="grid h-20 w-20 place-items-center rounded-full border border-paper/70 bg-ink/35 backdrop-blur-[2px] transition-transform duration-500 group-hover:scale-110">
                      <svg viewBox="0 0 24 24" className="ml-1 h-6 w-6 fill-paper" aria-hidden>
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </span>
                  </span>
                  <span className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-ink/70 to-transparent" />
                  <span className="absolute bottom-5 left-5 right-5 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-paper">
                    <span className="inline-flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-gold-bright" aria-hidden />
                      On YouTube
                    </span>
                    {duration && (
                      <>
                        <span aria-hidden className="opacity-50">
                          ·
                        </span>
                        <span className="opacity-80">{duration}</span>
                      </>
                    )}
                  </span>
                </>
              )}
            </Link>
          </div>

          <div className="reveal flex flex-col justify-between lg:col-span-5">
            <div>
              <p className="eyebrow text-gold">{service ? fmtDate(service.date) : "To be announced"}</p>
              <h3 className="display-md mt-5">
                {service?.title ?? "The next Sunday service will be announced here."}
              </h3>
              {service ? (
                <p className="mt-6 text-[15px] leading-relaxed text-muted">{service.description}</p>
              ) : (
                <p className="mt-6 border-l-2 border-gold pl-4 text-[14px] leading-relaxed text-ink">
                  <ServiceTime />
                </p>
              )}

              {service && (
                <dl className="mt-8 grid grid-cols-3 gap-px border border-line bg-line text-center">
                  <div className="bg-paper px-3 py-5">
                    <dt className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-light">
                      Date
                    </dt>
                    <dd className="numeral mt-2 text-lg">
                      {new Date(`${service.date}T12:00:00Z`).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        timeZone: "UTC",
                      })}
                    </dd>
                  </div>
                  <div className="bg-paper px-3 py-5">
                    <dt className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-light">
                      Length
                    </dt>
                    <dd className="numeral mt-2 text-lg">{duration ?? "—"}</dd>
                  </div>
                  <div className="bg-paper px-3 py-5">
                    <dt className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-light">
                      Views
                    </dt>
                    <dd className="numeral mt-2 text-lg">
                      {service.views ? service.views.toLocaleString("en-GB") : "—"}
                    </dd>
                  </div>
                </dl>
              )}
            </div>

            <div className="mt-10 flex flex-wrap gap-3">
              <Link href="/live" className="btn btn-ink">
                Watch Live
              </Link>
              <Link href="/sermons" className="btn btn-ghost text-ink">
                All Services
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
