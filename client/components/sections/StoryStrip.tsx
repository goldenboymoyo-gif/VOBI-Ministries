import Link from "next/link";

import { story } from "@/content/story";
import { SectionHead } from "@/components/ui/SectionHead";

export function StoryStrip() {
  return (
    <section className="overflow-hidden border-b border-line bg-paper-dim py-20 md:py-28">
      <div className="shell">
        <SectionHead
          index="03"
          eyebrow="Our story"
          title={
            <>
              Only what can
              <br />
              be dated.
            </>
          }
          aside={
            <p className="max-w-md text-[15px] leading-relaxed text-muted">
              VOBI has not published a founding date, so we do not print one. What follows is the
              record that does exist — each entry taken from the ministry&apos;s own uploads or a
              public listing, and nothing else.
            </p>
          }
        />
      </div>

      <div className="mt-14 overflow-x-auto pb-4 [scrollbar-width:thin]">
        <ol className="flex min-w-max snap-x gap-px bg-line px-[max(1.25rem,4vw)] lg:px-[max(4.5rem,4vw)]">
          {story.map((entry, i) => (
            <li
              key={`${entry.year}-${i}`}
              className="reveal w-[86vw] max-w-[420px] snap-start bg-paper-dim px-7 py-9 sm:w-[64vw] md:w-[38vw]"
            >
              <p className="numeral text-[11px] tracking-[0.2em] text-gold">{entry.year}</p>
              <h3 className="display-sm mt-5">{entry.title}</h3>
              <p className="mt-4 text-[14px] leading-relaxed text-muted">{entry.body}</p>
              <p className="mt-6 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-light">
                Source · {entry.source}
              </p>
            </li>
          ))}
        </ol>
      </div>

      <div className="shell mt-10">
        <Link href="/about/story" className="btn btn-ghost text-ink">
          Read the full story
        </Link>
      </div>
    </section>
  );
}
