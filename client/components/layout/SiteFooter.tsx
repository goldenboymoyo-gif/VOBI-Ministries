import Link from "next/link";

import { site, mapsDirectionsUrl } from "@/config/site";
import { socialLinks } from "@/config/socialLinks";
import { getSite } from "@/lib/settings";
import { Logo } from "@/components/ui/Logo";
import { SocialLinks } from "@/components/ui/SocialLinks";

const YEAR = new Date().getFullYear();

const quick = [
  { label: "About VOBI", href: "/about" },
  { label: "Statement of Faith", href: "/about#faith" },
  { label: "VOBI TV", href: "/sermons" },
  { label: "Testimonies", href: "/testimonies" },
  { label: "Events", href: "/events" },
  { label: "Give & Partner", href: "/give" },
  { label: "Store", href: "/store" },
];

const help = [
  { label: "Watch Live", href: "/live" },
  { label: "Prayer Request", href: "/prayer" },
  { label: "Plan Your Visit", href: "/visit" },
  { label: "Contact Us", href: "/contact" },
];

export async function SiteFooter() {
  const site = await getSite();
  const tel = (n: string) => `tel:${n.replace(/\s+/g, "")}`;
  return (
    <footer className="gold-wash text-white">
      <div className="shell grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <Logo tone="reverse" />
          <p className="mt-6 max-w-xs text-lg font-semibold italic">&ldquo;{site.statements.bioLine}&rdquo;</p>
          <SocialLinks links={socialLinks} tone="reverse" className="mt-6" />
        </div>
        <div>
          <h3 className="text-lg font-extrabold uppercase">Quick links</h3>
          <ul className="mt-4 space-y-2.5">
            {quick.map((l) => <li key={l.href}><Link href={l.href} className="hover:underline">{l.label}</Link></li>)}
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-extrabold uppercase">Get involved</h3>
          <ul className="mt-4 space-y-2.5">
            {help.map((l) => <li key={l.href}><Link href={l.href} className="hover:underline">{l.label}</Link></li>)}
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-extrabold uppercase">Visit us</h3>
          <address className="mt-4 space-y-2.5 not-italic">
            <p>{site.address}</p>
            <p>{site.service.day}s at {site.service.time}</p>
            <p><a href={tel(site.phone)} className="hover:underline">{site.phone}</a></p>
            <p><a href={`mailto:${site.email}`} className="break-all hover:underline">{site.email}</a></p>
            <p><a href={mapsDirectionsUrl()} target="_blank" rel="noopener noreferrer" className="font-semibold underline">Get directions</a></p>
          </address>
        </div>
      </div>
      <div className="bg-ink/85">
        <div className="shell flex flex-col gap-3 py-5 text-sm text-white/70 md:flex-row md:items-center md:justify-between">
          <p>© {YEAR} {site.fullName}. All rights reserved.</p>
          <p className="flex gap-5">
            <Link href="/privacy" className="hover:text-white">Privacy</Link>
            <Link href="/terms" className="hover:text-white">Terms</Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
