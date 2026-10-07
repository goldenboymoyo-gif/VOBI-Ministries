import Link from "next/link";

import { site, mapsDirectionsUrl } from "@/config/site";
import { socialLinks } from "@/config/socialLinks";
import { seedMinistries } from "@/content/ministries";
import { Logo } from "@/components/ui/Logo";
import { SocialLinks } from "@/components/ui/SocialLinks";
import { ServiceTime } from "@/components/ui/ServiceTime";

const YEAR = new Date().getFullYear();

const explore = [
  { label: "Home", href: "/" },
  { label: "About the ministry", href: "/about" },
  { label: "Our story", href: "/about/story" },
  { label: "Leadership", href: "/about/leadership" },
  { label: "Sermons", href: "/sermons" },
  { label: "Live", href: "/live" },
  { label: "Events", href: "/events" },
  { label: "Prayer", href: "/prayer" },
  { label: "Testimonies", href: "/testimonies" },
  { label: "Plan your visit", href: "/visit" },
  { label: "Contact", href: "/contact" },
];

export function SiteFooter() {
  return (
    <footer className="bg-ink text-paper">
      <div className="shell pt-20 pb-12 md:pt-24">
        <div className="grid gap-14 md:grid-cols-12 md:gap-10">
          <div className="md:col-span-4">
            <Logo tone="reverse" />
            <p className="mt-7 max-w-sm font-display text-[1.35rem] leading-[1.28] tracking-[-0.02em] text-paper/85">
              &ldquo;{site.statements.bioLine}&rdquo;
            </p>
            <p className="mt-5 max-w-xs text-[13px] leading-relaxed text-paper/55">
              {site.fullName} — {site.city}, {site.country}. Services stream live every{" "}
              {site.service.day}.
            </p>
            <SocialLinks links={socialLinks} tone="reverse" className="mt-8" showLabel />
          </div>

          <div className="md:col-span-2">
            <h2 className="eyebrow text-paper/45">Explore</h2>
            <ul className="mt-6 space-y-2.5">
              {explore.map((l) => (
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

          <div className="md:col-span-3">
            <h2 className="eyebrow text-paper/45">Ministries</h2>
            <ul className="mt-6 space-y-2.5">
              {seedMinistries.map((m) => (
                <li key={m.id}>
                  <Link
                    href={`/ministries/${m.slug}`}
                    className="link-underline text-[13px] text-paper/75 transition-colors hover:text-paper"
                  >
                    {m.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-3">
            <h2 className="eyebrow text-paper/45">Visit</h2>
            <address className="mt-6 space-y-5 not-italic text-[14px] leading-relaxed">
              <div>
                <span className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-paper/40">
                  Address
                </span>
                <span className="mt-1 block text-paper/85">{site.address}</span>
              </div>
              <div>
                <span className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-paper/40">
                  Service time
                </span>
                <span className="mt-1 block text-paper/85">
                  <ServiceTime />
                </span>
              </div>
              <div>
                <span className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-paper/40">
                  Telephone
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
                <Link
                  href={mapsDirectionsUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-underline mt-1 inline-block text-paper/85"
                >
                  Directions
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
          <p className="text-paper/35">Mkhosana · {site.city}, {site.country}</p>
        </div>
      </div>
    </footer>
  );
}