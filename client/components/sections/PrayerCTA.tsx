import Link from "next/link";

export function PrayerCTA() {
  return (
    <section className="relative overflow-hidden bg-ink text-paper">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(135deg, currentColor 0 1px, transparent 1px 22px)",
        }}
      />
      <div className="shell relative py-20 md:py-28">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="reveal lg:col-span-7">
            <p className="eyebrow text-gold-bright">Prayer</p>
            <h2 className="display-lg mt-6 max-w-[15ch]">
              Send us what
              <br />
              you are carrying.
            </h2>
          </div>
          <div className="reveal flex flex-col justify-end lg:col-span-5">
            <p className="text-[15px] leading-relaxed text-paper/70 md:text-base">
              Prayer requests sent through this site are read by the ministry and held privately —
              they are never published, listed or shared with anyone else.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/prayer" className="btn btn-solid">
                Send a prayer request
              </Link>
              <Link href="/sermons" className="btn btn-ghost">
                Teachings on prayer
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
