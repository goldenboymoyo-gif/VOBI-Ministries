import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

import { Masthead } from "@/components/ui/Masthead";
import { getTestimonies } from "@/lib/data";
import { site } from "@/config/site";

export const metadata: Metadata = {
  title: "Testimonies",
  description: `Testimonies published by Valley of Blessings International Ministries — healing, breakthrough, family restoration and deliverance, in the words of the people who lived them.`,
  alternates: { canonical: "/testimonies" },
};

export default async function TestimoniesPage() {
  const testimonies = await getTestimonies();

  return (
    <>
      <Masthead image="/photos/worship.jpg"
        eyebrow="Testimonies"
        crumbs={[{ label: "Home", href: "/" }, { label: "Testimonies" }]}
        title="Testimonies"
        intro="God is still working. Watch and be encouraged."
      />

      <section className="bg-paper py-20 md:py-28">
        <div className="shell">
          {testimonies.length === 0 ? (
            <div className="border border-line bg-paper-dim px-7 py-14 md:px-14">
              <p className="max-w-2xl font-display text-[clamp(1.4rem,2.6vw,2rem)] leading-[1.18] tracking-[-0.02em]">
                New testimonies are added regularly. Watch more on our YouTube channel.
              </p>
              <div className="mt-8">
                <Link href="/contact" className="btn btn-ink">
                  Send a testimony
                </Link>
              </div>
            </div>
          ) : (
            <ul className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {testimonies.map((t) => (
                <li key={t.id} className="reveal">
                  <a
                    href={t.youtubeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group block"
                  >
                    <span className="frame frame-hover relative block aspect-video">
                      <Image
                        src={t.thumbnail}
                        alt={t.title}
                        width={640}
                        height={360}
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
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
                    <span className="mt-5 block font-display text-[1.2rem] leading-[1.18] tracking-[-0.02em] transition-transform duration-500 group-hover:translate-x-1">
                      {t.title}
                    </span>
                    <span className="mt-3 block text-sm font-semibold text-muted">
                      {t.person ? `${t.person}${t.location ? ` · ${t.location}` : ""}` : site.fullName}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </>
  );
}
