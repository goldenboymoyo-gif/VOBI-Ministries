import Link from "next/link";
import Image from "next/image";

import { site } from "@/config/site";
import { thumb } from "@/lib/media";

const facts = [
  { k: "Ministry", v: site.fullName },
  { k: "City", v: `${site.city}, ${site.country}` },
  { k: "Address", v: site.address },
  { k: "Leadership", v: "Prophet Promise" },
  { k: "Service", v: `${site.service.day} · ${site.service.time}` },
  { k: "Channel", v: "882 videos published on the official channel" },
];

export function WelcomeToVobi() {
  return (
    <section className="border-b border-line bg-paper py-20 md:py-28">
      <div className="shell grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="reveal lg:col-span-6">
          <div className="frame aspect-video">
            <Image
              src={thumb("KRoODbK1al8")}
              alt="The Sunday service at Valley of Blessings International Ministries in Victoria Falls"
              width={1280}
              height={720}
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
          <p className="mt-4 text-[12px] text-muted-light">
            The Sunday service at VOBI, broadcast live by the ministry from Victoria Falls.
          </p>
        </div>

        <div className="reveal lg:col-span-6">
          <p className="eyebrow text-gold">Welcome</p>
          <h2 className="display-md mt-6 max-w-[16ch]">Welcome to VOBI.</h2>

          <div className="mt-8 space-y-6 text-[15px] leading-relaxed text-muted md:text-base">
            <p>
              {site.fullName} is a church in the Mkhosana suburb of {site.city},{" "}
              {site.country}, ministered by Prophet Promise. Every Sunday service, mass
              prayer and teaching is gathered from Scripture and carried live on the
              ministry&apos;s own channels.
            </p>
            <p>
              That means a congregation in Victoria Falls and a viewer thousands of
              kilometres away are watching the same meeting, at the same time.
            </p>
            <p className="border-l-2 border-gold pl-5 font-display text-[1.3rem] leading-[1.3] tracking-[-0.02em] text-ink">
              {site.statements.distance}
            </p>
          </div>

          <dl className="mt-10 border-t border-line">
            {facts.map((f) => (
              <div
                key={f.k}
                className="grid grid-cols-[7.5rem_1fr] gap-4 border-b border-line py-3.5 md:grid-cols-[9rem_1fr]"
              >
                <dt className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-light">
                  {f.k}
                </dt>
                <dd className="text-[14px] leading-relaxed text-ink">{f.v}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/about" className="btn btn-ink">
              About the ministry
            </Link>
            <Link href="/visit" className="btn btn-ghost text-ink">
              Plan your visit
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
