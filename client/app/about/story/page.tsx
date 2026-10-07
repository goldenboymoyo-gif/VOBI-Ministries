import type { Metadata } from "next";
import Link from "next/link";

import { Masthead } from "@/components/ui/Masthead";
import { story, missingHistory } from "@/content/story";
import { socialLinks } from "@/config/socialLinks";
import { SocialLinks } from "@/components/ui/SocialLinks";

export const metadata: Metadata = {
  title: "Our Story",
  description:
    "The dated, verifiable record of Valley of Blessings International Ministries — from the earliest service on 8 May 2016 to today. No founding date is claimed, because none has been published.",
  alternates: { canonical: "/about/story" },
};

export default function StoryPage() {
  return (
    <>
      <Masthead
        eyebrow="Our story"
        crumbs={[
          { label: "Home", href: "/" },
          { label: "About", href: "/about" },
          { label: "Our Story" },
        ]}
        title={
          <>
            A record,
            <br />
            not a <em className="not-italic text-gold-bright">legend</em>.
          </>
        }
        intro="There is no published founding date for VOBI, and no founder's biography in the public record. So this page holds only what the ministry itself has published, dated."
      />

      <section className="bg-paper py-20 md:py-28">
        <div className="shell-narrow">
          <ol className="border-t border-line">
            {story.map((entry, i) => (
              <li key={`${entry.year}-${i}`} className="reveal grid gap-4 border-b border-line py-10 md:grid-cols-12 md:gap-8 md:py-12">
                <div className="md:col-span-3">
                  <p className="numeral text-[clamp(1.5rem,3vw,2.25rem)] leading-none text-gold">
                    {entry.year}
                  </p>
                </div>
                <div className="md:col-span-9">
                  <h2 className="display-sm">{entry.title}</h2>
                  <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-muted">
                    {entry.body}
                  </p>
                  <p className="mt-5 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-light">
                    Source · {entry.source}
                  </p>
                </div>
              </li>
            ))}
          </ol>

          <div className="reveal mt-16 border border-line bg-paper-dim px-7 py-10 md:px-10 md:py-12">
            <p className="eyebrow text-gold">Not yet published</p>
            <h2 className="display-sm mt-5 max-w-[24ch]">
              The parts of the story VOBI has not told yet.
            </h2>
            <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-muted">
              We will not guess at these. Each one becomes part of this page the moment the
              ministry supplies it.
            </p>
            <ul className="mt-7 grid gap-px border border-line bg-line sm:grid-cols-2">
              {missingHistory.map((m) => (
                <li key={m} className="bg-paper-dim px-5 py-4 text-[13px] text-ink">
                  {m}
                </li>
              ))}
            </ul>
          </div>

          <div className="reveal mt-12 flex flex-wrap gap-3">
            <Link href="/about/leadership" className="btn btn-ink">
              Leadership
            </Link>
            <Link href="/about" className="btn btn-ghost text-ink">
              About VOBI
            </Link>
          </div>

          <div className="reveal mt-14 border-t border-line pt-8">
            <p className="eyebrow text-muted-light">Official channels</p>
            <SocialLinks links={socialLinks} className="mt-5" showLabel />
          </div>
        </div>
      </section>
    </>
  );
}
