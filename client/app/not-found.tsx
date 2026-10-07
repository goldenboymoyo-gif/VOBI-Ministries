import Link from "next/link";

import { socialLinks } from "@/config/socialLinks";
import { SocialLinks } from "@/components/ui/SocialLinks";

export default function NotFound() {
  return (
    <section className="bg-ink text-paper">
      <div className="shell flex min-h-[72vh] flex-col justify-center py-32">
        <p className="eyebrow text-gold-bright">404</p>
        <h1 className="display-xl mt-6 max-w-[14ch]">
          This page
          <br />
          isn&apos;t here.
        </h1>
        <p className="mt-8 max-w-lg text-[15px] leading-relaxed text-paper/70">
          The link may be old, or the page may not have been published yet. Everything that does
          exist is one click away.
        </p>
        <div className="mt-10 flex flex-wrap gap-3">
          <Link href="/" className="btn btn-solid">
            Back to home
          </Link>
          <Link href="/sermons" className="btn btn-ghost">
            The library
          </Link>
          <Link href="/contact" className="btn btn-ghost">
            Contact us
          </Link>
        </div>
        <div className="mt-12 border-t border-line-dark pt-8">
          <SocialLinks links={socialLinks} tone="reverse" showLabel />
        </div>
      </div>
    </section>
  );
}
