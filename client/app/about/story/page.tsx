import type { Metadata } from "next";

import { Masthead } from "@/components/ui/Masthead";
import { CtaBand } from "@/components/ui/CtaBand";
import { story } from "@/content/story";

export const metadata: Metadata = {
  title: "Our Story",
  description: "How Valley of Blessings International Ministries has grown from Sunday gatherings in Victoria Falls to a ministry watched around the world.",
  alternates: { canonical: "/about/story" },
};

export default function StoryPage() {
  return (
    <>
      <Masthead eyebrow="Our story" title="From Victoria Falls to the world" image="/media/pWvcKKfaXPs-maxresdefault.jpg"
        intro="Sunday services, mass prayer, testimonies and outreach — recorded and shared year after year." crumbs={[{ label: "About", href: "/about" }, { label: "Our story" }]} />
      <section className="bg-paper py-16 md:py-24">
        <div className="shell-narrow">
          <ol className="space-y-0">
            {story.map((e, i) => (
              <li key={i} className="reveal grid gap-4 border-t border-line py-10 md:grid-cols-[10rem_1fr] md:gap-10">
                <p className="font-display text-4xl font-extrabold text-gold md:text-5xl">{e.year}</p>
                <div>
                  <h2 className="display-sm">{e.title}</h2>
                  <p className="mt-3 text-[16px] leading-relaxed text-muted">{e.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>
      <CtaBand title="Be part of the next chapter" text="Worship with us on Sunday or watch live from anywhere." href="/live" label="Watch live" />
    </>
  );
}
