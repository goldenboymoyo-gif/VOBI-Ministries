import type { Metadata } from "next";
import Link from "next/link";

import { Masthead } from "@/components/ui/Masthead";
import { site } from "@/config/site";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: `Terms for the use of the Valley of Blessings International Ministries website.`,
  alternates: { canonical: "/terms" },
};

const sections = [
  {
    title: "About this website",
    body: [
      `This website is the online presence of ${site.fullName} in ${site.city}, ${site.country}. It publishes information about the ministry, its services, its teaching and how to reach it.`,
      "Content on this site is provided for information. It does not replace the ministry's own teaching, counsel or decisions.",
    ],
  },
  {
    title: "Use of content",
    body: [
      "Sermons, services, testimonies and other media remain the property of the ministry and are published through its official channels. You may watch and share them through the links provided.",
      "You may not present material from this site as your own, or alter it in a way that misrepresents the ministry.",
    ],
  },
  {
    title: "Third-party links",
    body: [
      "This site links to YouTube, social platforms, Google Maps and other third-party services. Those services are governed by their own terms, and the ministry is not responsible for them.",
    ],
  },
  {
    title: "Contact",
    body: [
      `Questions about these terms can be sent to ${site.email}, or by telephone on ${site.phone}.`,
      "Final terms are subject to approval by Valley of Blessings International Ministries.",
    ],
  },
];

export default function TermsPage() {
  return (
    <>
      <Masthead
        eyebrow="Legal"
        crumbs={[{ label: "Home", href: "/" }, { label: "Terms of Service" }]}
        title="Terms of Service"
        intro="The terms for using this website."
      />

      <section className="border-b border-line bg-paper py-20 md:py-28">
        <div className="shell-narrow">
          <div className="reveal space-y-12">
            {sections.map((s) => (
              <div key={s.title}>
                <h2 className="display-sm">{s.title}</h2>
                <div className="mt-5 space-y-4 text-[15.5px] leading-relaxed text-muted">
                  {s.body.map((p) => (
                    <p key={p.slice(0, 32)}>{p}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="reveal mt-14 flex flex-wrap gap-3">
            <Link href="/contact" className="btn btn-ink">
              Contact the ministry
            </Link>
            <Link href="/privacy" className="btn btn-ghost text-ink">
              Privacy Policy
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
