import Link from "next/link";

import { site, mapsDirectionsUrl, mapsEmbedUrl } from "@/config/site";
import { socialLinks } from "@/config/socialLinks";
import { SocialLinks } from "@/components/ui/SocialLinks";
import { ServiceTime } from "@/components/ui/ServiceTime";

export function VisitSection() {
  return (
    <section id="visit" className="relative overflow-hidden bg-ink text-paper">
      <div className="grid lg:grid-cols-2">
        <div className="reveal px-[max(1.25rem,4vw)] py-20 md:py-28 lg:pl-[max(4.5rem,4vw)] lg:pr-16">
          <p className="eyebrow text-gold-bright">Visit</p>
          <h2 className="display-md mt-6 max-w-[14ch]">Plan your visit</h2>

          <dl className="mt-12 space-y-8 border-t border-line-dark pt-8">
            <div>
              <dt className="text-sm font-semibold text-paper/45">
                Address
              </dt>
              <dd className="mt-2 text-[15px] leading-relaxed text-paper/85">{site.address}</dd>
            </div>
            <div>
              <dt className="text-sm font-semibold text-paper/45">
                Telephone
              </dt>
              <dd className="mt-2">
                <a
                  href={`tel:${site.phone.replace(/\s+/g, "")}`}
                  className="link-underline text-[15px] text-paper/85"
                >
                  {site.phone}
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-sm font-semibold text-paper/45">
                Email
              </dt>
              <dd className="mt-2">
                <a
                  href={`mailto:${site.email}`}
                  className="link-underline text-[15px] text-paper/85"
                >
                  {site.email}
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-sm font-semibold text-paper/45">
                Prayer line
              </dt>
              <dd className="mt-2">
                <a
                  href={`tel:${site.prayerPhone?.replace(/\s+/g, "")}`}
                  className="link-underline text-[15px] text-paper/85"
                >
                  {site.prayerPhone}
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-sm font-semibold text-paper/45">
                Service times
              </dt>
              <dd className="mt-2 max-w-md text-[15px] leading-relaxed text-paper/85">
                <ServiceTime />
              </dd>
            </div>
          </dl>

          <div className="mt-10 flex flex-wrap gap-3">
            <a
              href={mapsDirectionsUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-solid"
            >
              Get directions
            </a>
            <Link href="/live" className="btn btn-ghost">
              Watch live
            </Link>
            <Link href="/contact" className="btn btn-ghost">
              Contact us
            </Link>
          </div>

          <SocialLinks links={socialLinks} tone="reverse" className="mt-10" showLabel />
        </div>

        <div className="relative min-h-[340px] border-t border-line-dark lg:min-h-[720px] lg:border-l lg:border-t-0">
          <iframe
            title={`Map showing ${site.fullName} in ${site.city}`}
            src={mapsEmbedUrl()}
            className="absolute inset-0 h-full w-full grayscale-[0.35] contrast-[1.05]"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
          <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-line-dark" />
        </div>
      </div>
    </section>
  );
}
