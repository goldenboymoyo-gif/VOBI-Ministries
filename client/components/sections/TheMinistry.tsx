import Link from "next/link";
import Image from "next/image";

import { thumb } from "@/lib/media";

export function TheMinistry() {
  return (
    <section className="border-b border-line bg-paper py-20 md:py-28">
      <div className="shell grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="reveal lg:col-span-7">
          <p className="eyebrow text-gold">The ministry</p>
          <h2 className="display-md mt-6 max-w-[18ch]">The ministry VOBI publishes.</h2>

          <div className="mt-8 space-y-6 text-[15px] leading-relaxed text-muted md:text-base">
            <p>
              The oldest service on VOBI&apos;s official channel is dated Sunday 8 May 2016.
              From there the public record runs continuously: Mass Prayer gatherings that
              began in 2017, a channel opened to the world in February 2019, outreach into
              Botswana and Zambia, an annual Candle Light Crossover service, and more than
              eight hundred videos published to this day.
            </p>
            <p>
              The ministry introduces every Sunday broadcast the same way — welcoming viewers
              around the globe into the service in the presence of God Almighty. Teaching is
              preached from Scripture by Prophet Promise, and the meetings are not hurried.
            </p>
            <p>
              Where VOBI has not published something — a founding date, a founder&apos;s story,
              a building&apos;s history — this site says so plainly rather than filling the
              space with a guess.
            </p>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/about" className="btn btn-ink">
              Learn more
            </Link>
            <Link href="/about/story" className="btn btn-ghost text-ink">
              Our story
            </Link>
          </div>
        </div>

        <div className="reveal lg:col-span-5">
          <div className="frame aspect-[4/5]">
            <Image
              src={thumb("7PQllxO7OWQ")}
              alt="VOBI Sunday service broadcast from Victoria Falls"
              width={1280}
              height={1600}
              sizes="(max-width: 1024px) 100vw, 42vw"
              className="object-cover"
            />
          </div>
          <p className="mt-4 text-[12px] text-muted-light">
            A Sunday service published by VOBI on its official channel.
          </p>
        </div>
      </div>
    </section>
  );
}
