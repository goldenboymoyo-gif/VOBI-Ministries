import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

import { Masthead } from "@/components/ui/Masthead";

import { thumb } from "@/lib/media";

export const metadata: Metadata = {
  title: "Leadership — Prophet Promise",
  description:
    "Prophet Promise leads Valley of Blessings International Ministries in Victoria Falls, Zimbabwe. This page contains only what the ministry has published about itself.",
  alternates: { canonical: "/about/leadership" },
};

const known = [
  { k: "Name", v: "Prophet Promise" },
  { k: "Role", v: "Lead minister of Valley of Blessings International Ministries" },
  { k: "Published under", v: "PROPHET PROMISE MINISTRIES (official YouTube channel)" },
  { k: "Ministry base", v: "Victoria Falls, Matabeleland North, Zimbabwe" },
  { k: "Message archive", v: "882 videos published on the official channel" },
];

export default function LeadershipPage() {
  return (
    <>
      <Masthead
        eyebrow="Leadership"
        crumbs={[
          { label: "Home", href: "/" },
          { label: "About", href: "/about" },
          { label: "Leadership" },
        ]}
        title={
          <>
            Prophet
            <br />
            <em className="not-italic text-gold-bright">Promise</em>.
          </>
        }
        intro="The ministry VOBI publishes — every sermon, service and prayer on the official channel is ministered by Prophet Promise."
      />

      <section className="border-b border-line bg-paper py-20 md:py-28">
        <div className="shell grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="reveal lg:col-span-7">
            <div className="frame aspect-video">
              <Image
                src={thumb("GiScarDvZec")}
                alt="Prophet Promise ministering in a VOBI Sunday service from Victoria Falls"
                width={1280}
                height={720}
                sizes="(max-width: 1024px) 100vw, 56vw"
                className="object-cover"
              />
            </div>
            <p className="mt-4 text-[12px] text-muted-light">
              Prophet Promise ministering in a VOBI Sunday service, published by the ministry on
              its official channel.
            </p>

            <div className="mt-10 space-y-6 text-[15px] leading-relaxed text-muted md:text-base">
              <p className="font-display text-[clamp(1.3rem,2.2vw,1.85rem)] leading-[1.25] tracking-[-0.02em] text-ink">
                {`"Viewers around the globe, welcome to the Sunday service in the presence of God Almighty in VOBI Ministries with the man of God Prophet Promise."`}
              </p>
              <p>
                That is how the ministry introduces its own Sunday broadcasts — in its own words,
                on its own channel.
              </p>
              <p>
                Prophet Promise teaches through the full Sunday service, the mass prayer gatherings
                and the sermon library: recent messages include{" "}
                <span className="text-ink">Power In The Mouth</span>,{" "}
                <span className="text-ink">How to get your prayers answered</span> and{" "}
                <span className="text-ink">If God has said it no one can stop it</span>.
              </p>
            </div>

            <div className="mt-10 flex flex-wrap gap-3">
              <Link href="/sermons" className="btn btn-ink">
                Messages by Prophet Promise
              </Link>
              <Link href="/live" className="btn btn-ghost text-ink">
                Watch live
              </Link>
            </div>
          </div>

          <aside className="reveal lg:col-span-5">
            <div className="border border-line bg-paper-dim px-7 py-9">
              <p className="eyebrow text-gold">What is published</p>
              <dl className="mt-6">
                {known.map((r) => (
                  <div key={r.k} className="border-b border-line py-4 last:border-0">
                    <dt className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-light">
                      {r.k}
                    </dt>
                    <dd className="mt-1.5 text-[14px] leading-relaxed text-ink">{r.v}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="mt-6 border border-line px-7 py-9">
              <p className="eyebrow text-muted-light">Not yet published</p>
              <p className="mt-5 text-[14px] leading-relaxed text-muted">
                A ministry-approved portrait, a full biography, and the story of Prophet
                Promise&apos;s calling have not been released publicly. This page will carry them
                exactly as
                VOBI supplies them — no biography will be written on the ministry&apos;s behalf.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
