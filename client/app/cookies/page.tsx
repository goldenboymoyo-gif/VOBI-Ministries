import type { Metadata } from "next";
import Link from "next/link";

import { Masthead } from "@/components/ui/Masthead";
import { site } from "@/config/site";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description: `The cookies and similar technologies this website uses.`,
  alternates: { canonical: "/cookies" },
};

const sections = [
  {
    title: "What a cookie is",
    body: ["Cookies and similar technologies (such as local storage) are small pieces of data a website saves in your browser."],
  },
  {
    title: "What this website uses",
    body: [
      "Administrator login cookie (vobi_admin): set only when the ministry's staff sign in to the admin area. It is strictly necessary, HttpOnly, and expires after 8 hours. Visitors never receive it.",
      "Local storage (vobi-name and like markers): remembers the name you typed for comments or chat, and which videos you have liked, on your own device only. It is never sent to advertisers and you can clear it in your browser settings.",
      "This website does not use advertising, analytics or tracking cookies, so there is no consent banner to switch on or off.",
    ],
  },
  {
    title: "Third-party content",
    body: [
      "Videos are embedded from YouTube using youtube-nocookie.com. YouTube may still set cookies or store data once you press play. Some pages show a Google map, which may also set cookies. These are controlled by Google under its own policies.",
      "If you prefer not to receive them, do not play embedded videos or load the map, or block third-party cookies in your browser.",
    ],
  },
  {
    title: "Contact",
    body: [`Questions can be sent to ${site.email}, or by telephone on ${site.phone}.`, "Final policy text is subject to approval by Valley of Blessings International Ministries."],
  },
];

export default function CookiesPage() {
  return (
    <>
      <Masthead
        eyebrow="Legal"
        crumbs={[{ label: "Home", href: "/" }, { label: "Cookie Policy" }]}
        title="Cookie Policy"
        intro="Exactly what this website stores in your browser."
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
            <Link href="/terms" className="btn btn-ghost text-ink">
              Terms of Service
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
