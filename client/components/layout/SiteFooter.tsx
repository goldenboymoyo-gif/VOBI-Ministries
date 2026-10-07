import Link from "next/link";

import { site } from "@/config/site";
import { socialLinks } from "@/config/socialLinks";
import { Logo } from "@/components/ui/Logo";
import { SocialLinks } from "@/components/ui/SocialLinks";

const YEAR = new Date().getFullYear();

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Our Story", href: "/about/story" },
  { label: "Leadership", href: "/about/leadership" },
  { label: "Ministries", href: "/ministries" },
  { label: "Sermons", href: "/sermons" },
  { label: "Events", href: "/events" },
  { label: "Prayer", href: "/prayer" },
  { label: "Testimonies", href: "/testimonies" },
  { label: "Live", href: "/live" },
  { label: "Plan Your Visit", href: "/visit" },
  { label: "Contact", href: "/contact" },
];

export function SiteFooter() {
  return (
    <footer className="relative overflow-hidden bg-ink text-paper">
      <div className="shell pt-20 pb-12 md:pt-28">
        <div className="grid gap-14 md:grid-cols-12 md:gap-10">
          <div className="md:col-span-5">
            <Logo tone="reverse" />
            <p className="mt-7 max-w-sm font-display text-[1.5rem] leading-[1.2] tracking-[-0.02em] text-paper/85">
              {site.statements.bioLine}
            </p>
            <p className="mt-5 max-w-xs text-[13px] leading-relaxed text-paper/55">
              {site.fullName} — {site.city}, {site.country}.
            </p>
            <SocialLinks links={socialLinks} tone="reverse" className="mt-8" showLabel />
          </div>

          <div className="md:col-span-3">
            <h2 className="eyebrow text-paper/45">Quick Links</h2>
            <ul className="mt-6 grid grid-cols-2 gap-x-6 gap-y-2.5 md:grid-cols-1">
              {quickLinks.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="link-underline text-[13px] text-paper/75 transition-colors hover:text-paper"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-4">
            <h2 className="eyebrow text-paper/45">Contact</h2>
            <address className="mt-6 space-y-5 not-italic text-[14px] leading-relaxed">
              <div>
                <span className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-paper/40">
                  Phone
                </span>
                <a
                  href={`tel:${site.phone.replace(/\s+/g, "")}`}
                  className="link-underline mt-1 inline-block text-paper/85"
                >
                  {site.phone}
                </a>
              </div>
              <div>
                <span className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-paper/40">
                  Prayer line
                </span>
                <a
                  href={`tel:${site.prayerPhone.replace(/\s+/g, "")}`}
                  className="link-underline mt-1 inline-block text-paper/85"
                >
                  {site.prayerPhone}
                </a>
              </div>
              <div>
                <span className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-paper/40">
                  Email
                </span>
                <a
                  href={`mailto:${site.email}`}
                  className="link-underline mt-1 inline-block break-all text-paper/85"
                >
                  {site.email}
                </a>
              </div>
              <div>
                <span className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-paper/40">
                  Address
                </span>
                <span className="mt-1 block text-paper/85">{site.address}</span>
              </div>
              <div>
                <span className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-paper/40">
                  Write to us
                </span>
                <Link href="/contact" className="link-underline mt-1 inline-block text-paper/85">
                  Send a message
                </Link>
              </div>
            </address>
          </div>
        </div>

        <div className="mt-16 h-px w-full bg-line-dark" />

        <div className="mt-6 flex flex-col gap-4 text-[11px] uppercase tracking-[0.16em] text-paper/45 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {YEAR} {site.fullName}
          </p>
          <div className="flex flex-wrap gap-6">
            <Link href="/contact" className="transition-colors hover:text-paper">
              Privacy Policy
            </Link>
            <Link href="/contact" className="transition-colors hover:text-paper">
              Terms
            </Link>
          </div>
        </div>
      </div>

      <div
        aria-hidden="true"
        className="pointer-events-none select-none overflow-hidden border-t border-line-dark"
      >
        <p className="translate-y-[14%] whitespace-nowrap text-center font-display text-[clamp(4rem,20vw,20rem)] leading-[0.75] tracking-[-0.05em] text-paper/[0.05]">
          VOBI
        </p>
      </div>
    </footer>
  );
}
