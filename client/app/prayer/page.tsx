import type { Metadata } from "next";
import Link from "next/link";

import { Masthead } from "@/components/ui/Masthead";
import { MessageForm } from "@/components/ui/MessageForm";
import { site } from "@/config/site";

export const metadata: Metadata = {
  title: "Prayer",
  description:
    "Send a private prayer request to Valley of Blessings International Ministries. Requests are held privately by the ministry and are never published, listed or shared.",
  alternates: { canonical: "/prayer" },
};

const notes = [
  {
    title: "Held privately",
    body: "Requests sent through this page are read by the ministry and kept private. They are never published, listed or shared with anyone outside the ministry.",
  },
  {
    title: "Mass prayer",
    body: "Mass Prayer has run in VOBI's public ministry since 2017, alongside 'Pray Along with Prophet Promise'. Requests are brought into that same ministry of prayer.",
  },
  {
    title: "Teaching on prayer",
    body: "The library holds a two-part teaching series on prayer — 'How to get your prayers answered' — for those who want to go further.",
  },
];

export default function PrayerPage() {
  return (
    <>
      <Masthead
        eyebrow="Prayer"
        crumbs={[{ label: "Home", href: "/" }, { label: "Prayer" }]}
        title={
          <>
            Send us what
            <br />
            you are <em className="not-italic text-gold-bright">carrying</em>.
          </>
        }
        intro="Write your request below. It goes to the ministry directly — not to a public list, not to a comment thread, and nowhere on this website."
      />

      <section className="border-b border-line bg-paper py-20 md:py-28">
        <div className="shell grid gap-14 lg:grid-cols-12 lg:gap-16">
          <div className="reveal lg:col-span-7">
            <p className="eyebrow text-gold">Private prayer request</p>
            <div className="mt-8">
              <MessageForm variant="prayer" />
            </div>
          </div>

          <aside className="reveal lg:col-span-5">
            <div className="space-y-px border border-line bg-line">
              {notes.map((n, i) => (
                <div key={n.title} className="bg-paper px-7 py-8">
                  <p className="numeral text-[11px] tracking-[0.2em] text-muted-light">0{i + 1}</p>
                  <h2 className="display-sm mt-3">{n.title}</h2>
                  <p className="mt-3 text-[14px] leading-relaxed text-muted">{n.body}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 border border-line bg-paper-dim px-7 py-9">
              <p className="eyebrow text-muted-light">Rather speak to someone</p>
              <dl className="mt-6 space-y-6">
                <div>
                  <dt className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-light">
                    Prayer line
                  </dt>
                  <dd className="mt-2">
                    <a
                      href={`tel:${site.prayerPhone.replace(/\s+/g, "")}`}
                      className="link-underline font-display text-[1.5rem] tracking-[-0.02em] text-ink"
                    >
                      {site.prayerPhone}
                    </a>
                  </dd>
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
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/sermons?category=sermon" className="btn btn-ink">
                Teachings on prayer
              </Link>
              <Link href="/contact" className="btn btn-ghost text-ink">
                Contact us
              </Link>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
