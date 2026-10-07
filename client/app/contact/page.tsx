import type { Metadata } from "next";
import Link from "next/link";

import { Masthead } from "@/components/ui/Masthead";
import { MessageForm } from "@/components/ui/MessageForm";
import { site, mapsDirectionsUrl } from "@/config/site";
import { socialLinks } from "@/config/socialLinks";
import { SocialLinks } from "@/components/ui/SocialLinks";

export const metadata: Metadata = {
  title: "Contact",
  description: `Contact Valley of Blessings International Ministries in Victoria Falls, Zimbabwe. Telephone ${site.phone}, prayer line ${site.prayerPhone}, email ${site.email}, or send the ministry a message through this page.`,
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <>
      <Masthead
        eyebrow="Contact"
        crumbs={[{ label: "Home", href: "/" }, { label: "Contact" }]}
        title={
          <>
            Talk to
            <br />
            the <em className="not-italic text-gold-bright">ministry</em>.
          </>
        }
        intro="Send a message here and it goes straight to VOBI. For anything urgent, the church telephone is the fastest route."
      />

      <section className="bg-paper py-20 md:py-28">
        <div className="shell grid gap-14 lg:grid-cols-12 lg:gap-16">
          <div className="reveal lg:col-span-7">
            <p className="eyebrow text-gold">Send a message</p>
            <div className="mt-8">
              <MessageForm variant="contact" />
            </div>
          </div>

          <aside className="reveal lg:col-span-5">
            <div className="border border-line bg-paper-dim px-7 py-9">
              <p className="eyebrow text-muted-light">Direct</p>
              <dl className="mt-6 space-y-6">
                <div>
                  <dt className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-light">
                    Telephone
                  </dt>
                  <dd className="mt-2">
                    <a
                      href={`tel:${site.phone.replace(/\s+/g, "")}`}
                      className="link-underline font-display text-[1.5rem] tracking-[-0.02em] text-ink"
                    >
                      {site.phone}
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-light">
                    Prayer line
                  </dt>
                  <dd className="mt-2">
                    <a
                      href={`tel:${site.prayerPhone.replace(/\s+/g, "")}`}
                      className="link-underline text-[15px] text-ink"
                    >
                      {site.prayerPhone}
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-light">
                    Address
                  </dt>
                  <dd className="mt-2 text-[15px] leading-relaxed text-ink">{site.address}</dd>
                </div>
                <div>
                  <dt className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-light">
                    Email
                  </dt>
                  <dd className="mt-2">
                    <a
                      href={`mailto:${site.email}`}
                      className="link-underline text-[15px] text-ink"
                    >
                      {site.email}
                    </a>
                  </dd>
                </div>
              </dl>

              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href={mapsDirectionsUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-ink"
                >
                  Directions
                </a>
                <Link href="/visit" className="btn btn-ghost text-ink">
                  Plan a visit
                </Link>
              </div>
            </div>

            <div className="mt-6 border border-line px-7 py-9">
              <p className="eyebrow text-muted-light">Elsewhere</p>
              <SocialLinks links={socialLinks} className="mt-5" showLabel />
            </div>

            <p className="mt-6 text-[13px] leading-relaxed text-muted">
              Prefer to pray first? Send a{" "}
              <Link href="/prayer" className="link-underline text-ink">
                private prayer request
              </Link>{" "}
              instead — it is never published or shared.
            </p>
          </aside>
        </div>
      </section>
    </>
  );
}
