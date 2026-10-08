import Link from "next/link";

import { site, mapsDirectionsUrl } from "@/config/site";
import { socialLinks } from "@/config/socialLinks";
import { seedMinistries } from "@/content/ministries";
import { Logo } from "@/components/ui/Logo";
import { SocialLinks } from "@/components/ui/SocialLinks";
import { ServiceTime } from "@/components/ui/ServiceTime";

const YEAR = new Date().getFullYear();

const navigation = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "What We Believe", href: "/about/what-we-believe" },
  { label: "Ministries", href: "/ministries" },
  { label: "Sermons", href: "/sermons" },
  { label: "Blog", href: "/blog" },
  { label: "Devotionals", href: "/devotionals" },
  { label: "Branches", href: "/branches" },
  { label: "Give & Partner", href: "/give" },
  { label: "Store", href: "/store" },
  { label: "Events", href: "/events" },
  { label: "Prayer", href: "/prayer" },
  { label: "Contact", href: "/contact" },
];

const media = [
  { label: "Watch live", href: "/live" },
  { label: "Sunday services", href: "/sermons?category=service" },
  { label: "Testimonies", href: "/testimonies" },
  { label: "Send a prayer request", href: "/prayer" },
  { label: "Plan your visit", href: "/visit" },
];

export function SiteFooter() {
  return (
    <footer className="bg-ink text-paper">
      <div className="shell pt-20 pb-12 md:pt-24">
        <div className="grid gap-12 md:grid-cols-12 md:gap-10">
          <div className="md:col-span-4">
            <Logo tone="reverse" />
            <p className="mt-7 max-w-sm font-display text-[1.3rem] leading-[1.28] tracking-[-0.02em] text-paper/85">
              &ldquo;{site.statements.bioLine}&rdquo;
            </p>
            <p className="mt-5 max-w-xs text-[13px] leading-relaxed text-paper/55">
              {site.fullName} — {site.city}, {site.country}. Services stream live every{" "}
              {site.service.day}.
            </p>
            <SocialLinks links={socialLinks} tone="reverse" className="mt-8" showLabel />
          </div>

          <div className="md:col-span-3">
            <h2 className="eyebrow text-paper/45">Navigation</h2>
            <ul className="mt-6 space-y-2.5">
              {navigation.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-[13.5px] text-paper/75 transition-colors hover:text-paper"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-5">
            <div className="grid gap-10 sm:grid-cols-2">
              <div>
                <h2 className="eyebrow text-paper/45">Ministries</h2>
                <ul className="mt-6 space-y-2.5">
                  {seedMinistries.map((m) => (
                    <li key={m.id}>
                      <Link
                        href={`/ministries/${m.slug}`}
                        className="text-[13.5px] text-paper/75 transition-colors hover:text-paper"
                      >
                        {m.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h2 className="eyebrow text-paper/45">Media & prayer</h2>
                <ul className="mt-6 space-y-2.5">
                  {media.map((l) => (
                    <li key={l.href}>
                      <Link
                        href={l.href}
                        className="text-[13.5px] text-paper/75 transition-colors hover:text-paper"
                      >
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="md:col-span-12">
            <div className="rule-dark" />
            <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              <address className="space-y-4 not-italic text-[13.5px] leading-relaxed">
                <div>
                  <span className="block text-[10px] font-semibold uppercase tracking-[0.16em] text-paper/40">
                    Address
                  </span>
                  <span className="mt-1 block text-paper/85">{site.address}</span>
                </div>
                <div>
                  <span className="block text-[10px] font-semibold uppercase tracking-[0.16em] text-paper/40">
                    Service time
                  </span>
                  <span className="mt-1 block text-paper/85">
                    <ServiceTime />
                  </span>
                </div>
              </address>

              <div className="space-y-4 text-[13.5px] leading-relaxed">
                <div>
                  <span className="block text-[10px] font-semibold uppercase tracking-[0.16em] text-paper/40">
                    Telephone
                  </span>
                  <a
                    href={`tel:${site.phone.replace(/\s+/g, "")}`}
                    className="mt-1 inline-block text-paper/85 transition-colors hover:text-paper"
                  >
                    {site.phone}
                  </a>
                </div>
                <div>
                  <span className="block text-[10px] font-semibold uppercase tracking-[0.16em] text-paper/40">
                    Prayer line
                  </span>
                  <a
                    href={`tel:${site.prayerPhone.replace(/\s+/g, "")}`}
                    className="mt-1 inline-block text-paper/85 transition-colors hover:text-paper"
                  >
                    {site.prayerPhone}
                  </a>
                </div>
              </div>

              <div className="space-y-4 text-[13.5px] leading-relaxed">
                <div>
                  <span className="block text-[10px] font-semibold uppercase tracking-[0.16em] text-paper/40">
                    Email
                  </span>
                  <a
                    href={`mailto:${site.email}`}
                    className="mt-1 inline-block break-all text-paper/85 transition-colors hover:text-paper"
                  >
                    {site.email}
                  </a>
                </div>
                <div>
                  <span className="block text-[10px] font-semibold uppercase tracking-[0.16em] text-paper/40">
                    Directions
                  </span>
                  <Link
                    href={mapsDirectionsUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 inline-block text-paper/85 transition-colors hover:text-paper"
                  >
                    Open in Google Maps
                  </Link>
                </div>
              </div>

              <div className="space-y-4 text-[13.5px] leading-relaxed">
                <div>
                  <span className="block text-[10px] font-semibold uppercase tracking-[0.16em] text-paper/40">
                    Follow VOBI
                  </span>
                  <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2">
                    {socialLinks.map((s) => (
                      <a
                        key={s.url}
                        href={s.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-paper/85 transition-colors hover:text-paper"
                      >
                        {s.label}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 h-px w-full bg-line-dark" />

        <div className="mt-6 flex flex-col gap-4 text-[12.5px] text-paper/45 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {YEAR} {site.fullName}
          </p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <Link href="/privacy" className="transition-colors hover:text-paper">
              Privacy Policy
            </Link>
            <Link href="/terms" className="transition-colors hover:text-paper">
              Terms of Service
            </Link>
            <span className="text-paper/35">
              {site.city}, {site.country}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
