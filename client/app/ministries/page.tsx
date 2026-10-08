import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

import { Masthead } from "@/components/ui/Masthead";
import { getMinistries } from "@/lib/data";

export const metadata: Metadata = {
  title: "Ministries",
  description:
    "The four ministries documented in Valley of Blessings International Ministries' own published content: Sunday Worship, Prayer & Mass Prayer, Testimonies & Deliverance, and Humanitarian & Outreach.",
  alternates: { canonical: "/ministries" },
};

export default async function MinistriesPage() {
  const ministries = await getMinistries();

  return (
    <>
      <Masthead
        eyebrow="Ministries"
        crumbs={[{ label: "Home", href: "/" }, { label: "Ministries" }]}
        title={
          <>
            The works
            <br />
            we can <em className="not-italic text-gold-bright">evidence</em>.
          </>
        }
        intro="Every ministry listed here appears in VOBI's own uploads. Anything we could not confirm is left out rather than invented."
      />

      <section className="bg-paper py-20 md:py-28">
        <div className="shell space-y-px">
          {ministries.map((m) => (
            <article key={m.id} className="reveal border-b border-line first:border-t">
              <Link
                href={`/ministries/${m.slug}`}
                className="group grid gap-6 py-9 md:grid-cols-12 md:items-center md:gap-10 md:py-12"
              >
                <div className="md:col-span-6">
                  <h2 className="display-md transition-transform duration-500 group-hover:translate-x-1.5">
                    {m.name}
                  </h2>
                  <p className="mt-4 text-[15px] leading-relaxed text-muted">{m.summary}</p>
                </div>
                <div className="md:col-span-5">
                  <span className="frame frame-hover block aspect-video">
                    <Image
                      src={m.image}
                      alt={m.name}
                      width={640}
                      height={360}
                      sizes="(max-width: 768px) 100vw, 40vw"
                      className="object-cover"
                    />
                  </span>
                </div>
                <div className="md:col-span-1 md:justify-self-end">
                  <svg
                    viewBox="0 0 24 24"
                    className="h-5 w-5 stroke-current fill-none stroke-[1.5] transition-transform duration-500 group-hover:translate-x-1.5"
                    aria-hidden
                  >
                    <path d="M4 12h15M13 6l6 6-6 6" />
                  </svg>
                </div>
              </Link>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
