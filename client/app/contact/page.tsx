import type { Metadata } from "next";
import Link from "next/link";

import { getSite } from "@/lib/settings";
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

export default async function ContactPage() {
  const site = await getSite();
  const tel = (n: string) => `tel:${n.replace(/\s+/g, "")}`;
  const cards = [
    { k: "Prayer line", v: site.prayerPhone, href: tel(site.prayerPhone), d: "M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2z" },
    { k: "Email", v: site.email, href: `mailto:${site.email}`, d: "M3 6h18v12H3zM3 7l9 6 9-6" },
    { k: "Find us", v: site.address, href: mapsDirectionsUrl(), d: "M12 21s7-6.2 7-11a7 7 0 10-14 0c0 4.8 7 11 7 11zM12 12a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" },
  ];
  return (
    <>
      <Masthead image="/photos/praise.jpg"
        eyebrow="Contact"
        crumbs={[{ label: "Home", href: "/" }, { label: "Contact" }]}
        title="Contact Us"
        intro="Call, email or visit us in Victoria Falls."
      />

      <section className="bg-paper pb-20 md:pb-28">
        <div className="shell">
          <div className="relative z-10 -mt-10 grid gap-4 md:-mt-14 md:grid-cols-3">
            {cards.map((c) => (
              <a key={c.k} href={c.href} {...(c.k === "Find us" ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className="group flex items-start gap-4 rounded-2xl bg-white p-6 shadow-lg transition-transform duration-300 hover:-translate-y-1">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-gold-bright text-ink">
                  <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d={c.d} /></svg>
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-semibold uppercase tracking-wider text-muted">{c.k}</span>
                  <span className="mt-1 block break-words font-semibold text-ink group-hover:text-gold">{c.v}</span>
                </span>
              </a>
            ))}
          </div>

          <div className="mt-14 grid gap-10 lg:grid-cols-12 lg:gap-14">
            <div className="lg:col-span-7">
              <h2 className="text-2xl font-extrabold uppercase md:text-3xl">Send us a message</h2>
              <p className="mt-2 text-muted">We read every message and reply as soon as we can.</p>
              <div className="mt-8 rounded-2xl bg-white p-6 shadow-md md:p-8">
                <MessageForm variant="contact" />
              </div>
            </div>

            <aside className="space-y-6 lg:col-span-5">
              <div className="rounded-2xl bg-ink p-7 text-white">
                <p className="text-sm font-semibold uppercase tracking-wider text-gold-bright">Join us</p>
                <p className="mt-3 text-2xl font-extrabold">{site.service.day}s at {site.service.time}</p>
                <p className="mt-2 text-white/75">{site.address}</p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <a href={mapsDirectionsUrl()} target="_blank" rel="noopener noreferrer" className="btn btn-gold">Directions</a>
                  <Link href="/visit" className="btn btn-ghost text-white">Plan a visit</Link>
                </div>
              </div>

              <div className="rounded-2xl border border-line bg-white p-7">
                <p className="text-sm font-semibold uppercase tracking-wider text-muted">Follow us</p>
                <SocialLinks links={socialLinks} className="mt-4" showLabel />
              </div>

              <p className="px-1 text-sm leading-relaxed text-muted">
                Prefer to pray first? Send a{" "}
                <Link href="/prayer" className="link-underline text-ink">private prayer request</Link>
                {" "}instead, it is never published or shared.
              </p>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}
