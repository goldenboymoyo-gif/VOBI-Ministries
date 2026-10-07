import Link from "next/link";
import Image from "next/image";

import { thumb } from "@/lib/media";
import { SectionHead } from "@/components/ui/SectionHead";

const facts = [
  { k: "Role", v: "Lead minister of Valley of Blessings International Ministries" },
  { k: "Ministry base", v: "Victoria Falls, Matabeleland North, Zimbabwe" },
  { k: "Published under", v: "PROPHET PROMISE MINISTRIES (official channel)" },
  { k: "Message archive", v: "882 videos on the official channel" },
];

export function LeadershipSpotlight() {
  return (
    <section className="relative overflow-hidden bg-ink text-paper">
      <div className="shell py-20 md:py-28">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="reveal lg:col-span-5">
            <div className="relative aspect-[4/5] overflow-hidden bg-ink-700">
              <Image
                src={thumb("GiScarDvZec")}
                alt="Prophet Promise ministering in a VOBI Sunday service, Victoria Falls"
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover"
              />
              <span className="absolute inset-0 bg-ink/20" aria-hidden />
            </div>
            <p className="mt-4 text-[12px] leading-relaxed text-paper/45">
              Prophet Promise ministering in a Sunday service — published by VOBI on its
              official channel.
            </p>
          </div>

          <div className="reveal flex flex-col justify-center lg:col-span-7 lg:pl-6">
            <SectionHead
              tone="reverse"
              eyebrow="Leadership"
              title={<>Prophet Promise.</>}
            />

            <div className="mt-8 space-y-6 text-[15px] leading-relaxed text-paper/70 md:text-base">
              <p>
                Every sermon, service and prayer on VOBI&apos;s official channel is ministered
                by Prophet Promise. The ministry introduces its own broadcasts with the same
                line, service after service:
              </p>
              <blockquote className="border-l-2 border-gold-bright pl-5 font-display text-[1.4rem] leading-[1.3] tracking-[-0.02em] text-paper">
                &ldquo;Viewers around the globe, welcome to the Sunday service in the presence
                of God Almighty in VOBI Ministries with the man of God Prophet Promise.&rdquo;
              </blockquote>
              <p>
                Prophet Promise teaches through the full Sunday service, the mass prayer
                gatherings and the ongoing sermon library — recent messages include{" "}
                <span className="text-paper">Power In The Mouth</span>,{" "}
                <span className="text-paper">How to get your prayers answered</span> and{" "}
                <span className="text-paper">If God has said it no one can stop it</span>.
              </p>
            </div>

            <dl className="mt-10 border-t border-line-dark">
              {facts.map((f) => (
                <div key={f.k} className="grid grid-cols-[9rem_1fr] gap-4 border-b border-line-dark py-4">
                  <dt className="text-[10px] font-semibold uppercase tracking-[0.18em] text-paper/45">
                    {f.k}
                  </dt>
                  <dd className="text-[14px] leading-relaxed text-paper/85">{f.v}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-10 flex flex-wrap gap-3">
              <Link href="/about/leadership" className="btn btn-solid">
                About Prophet Promise
              </Link>
              <Link href="/sermons" className="btn btn-ghost">
                Messages by him
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}