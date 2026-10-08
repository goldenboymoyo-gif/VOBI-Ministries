import Link from "next/link";

import { site } from "@/config/site";
import { MessageForm } from "@/components/ui/MessageForm";

export function NeedPrayer() {
  return (
    <section className="border-b border-line bg-paper-dim py-20 md:py-28">
      <div className="shell grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="reveal lg:col-span-5">
          <p className="eyebrow text-gold">Prayer</p>
          <h2 className="display-md mt-6 max-w-[14ch]">Need prayer?</h2>

          <div className="mt-7 space-y-5 text-[15px] leading-relaxed text-muted md:text-base">
            <p>
              Send your request. It is read in private and never published.</p>
            <p>
              We pray over every request in mass prayer and on the prayer line.</p>
          </div>

          <dl className="mt-8 border-t border-line pt-6">
            <dt className="text-sm font-semibold text-muted-light">
              Prayer line
            </dt>
            <dd className="mt-2">
              <a
                href={`tel:${site.prayerPhone.replace(/\s+/g, "")}`}
                className="link-underline font-display text-[1.5rem] tracking-[-0.02em] text-ink"
              >
                {site.prayerPhone}
              </a>
            </dd>
          </dl>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/prayer" className="btn btn-ink">
              Teaching on prayer
            </Link>
            <a
              href={`tel:${site.prayerPhone.replace(/\s+/g, "")}`}
              className="btn btn-ghost text-ink"
            >
              Call the prayer line
            </a>
          </div>
        </div>

        <div className="reveal lg:col-span-7">
          <p className="eyebrow text-muted-light">Private prayer request</p>
          <div className="mt-7">
            <MessageForm variant="prayer" />
          </div>
        </div>
      </div>
    </section>
  );
}
