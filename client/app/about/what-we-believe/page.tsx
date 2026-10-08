import type { Metadata } from "next";

import { Masthead } from "@/components/ui/Masthead";
import { CtaBand } from "@/components/ui/CtaBand";
import { site } from "@/config/site";

export const metadata: Metadata = {
  title: "Statement of Faith",
  description: "What Valley of Blessings International Ministries believes and teaches.",
  alternates: { canonical: "/about/what-we-believe" },
};

const beliefs = [
  { n: "01", t: "Salvation in Christ", d: `${site.statements.bioLine} We believe that salvation is God's gift through Jesus Christ, and that no one earns it.` },
  { n: "02", t: "The Word of God", d: "Every service is preached from the Scriptures. We believe the Bible is the final word for faith and life." },
  { n: "03", t: "The Holy Spirit", d: "We believe the Holy Spirit leads the church. Our services are not rushed: they begin at 08:30 and end when the Holy Spirit gives a signal." },
  { n: "04", t: "Prayer", d: "We pray together, in mass prayer and on the prayer line, and we believe God answers prayer." },
  { n: "05", t: "Healing and deliverance", d: "We believe Jesus still heals the sick and sets people free. Hundreds of testimonies are on our channel." },
  { n: "06", t: "One church, everywhere", d: `${site.statements.distance} Wherever you watch from, you are part of the service.` },
];

export default function BelievePage() {
  return (
    <>
      <Masthead eyebrow="Statement of faith" title="What we believe" image="/photos/praise.jpg"
        intro={site.statements.bioLine} crumbs={[{ label: "About", href: "/about" }, { label: "Statement of faith" }]} />
      <section className="bg-paper py-16 md:py-24">
        <div className="shell grid gap-px bg-line md:grid-cols-2 lg:grid-cols-3">
          {beliefs.map((b) => (
            <div key={b.n} className="reveal bg-paper p-8 md:p-10">
              <p className="font-display text-5xl font-extrabold text-gold-bright">{b.n}</p>
              <h2 className="display-sm mt-4">{b.t}</h2>
              <p className="mt-3 leading-relaxed text-muted">{b.d}</p>
            </div>
          ))}
        </div>
      </section>
      <CtaBand title="Hear it preached" text="Watch the teaching from Prophet Promise." href="/sermons" label="Watch sermons" />
    </>
  );
}
