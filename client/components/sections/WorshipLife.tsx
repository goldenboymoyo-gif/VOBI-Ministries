import Image from "next/image";

import { thumb } from "@/lib/media";

const scenes = [
  { id: "aCLyo-8DdaM", caption: "Mass Prayer", alt: "VOBI mass prayer broadcast" },
  { id: "GiScarDvZec", caption: "Sunday Service", alt: "VOBI Sunday service from Victoria Falls" },
  { id: "RyeE1nU4_Fw", caption: "Testimonies", alt: "A testimony published by VOBI" },
];

export function WorshipLife() {
  return (
    <section className="relative overflow-hidden bg-ink text-paper">
      <div className="shell py-20 md:py-28">
        <div className="grid gap-6 md:grid-cols-3">
          {scenes.map((s, i) => (
            <figure key={s.id} className="reveal-clip relative overflow-hidden">
              <div
                className={`relative ${i === 1 ? "aspect-[3/4] md:mt-14" : "aspect-[4/5]"}`}
                data-parallax={i === 1 ? "10" : "5"}
              >
                <Image
                  src={thumb(s.id)}
                  alt={s.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover"
                />
                <span className="absolute inset-0 bg-ink/35" />
              </div>
              <figcaption className="absolute bottom-5 left-5 text-[11px] font-semibold uppercase tracking-[0.2em] text-paper/85">
                <span className="numeral mr-3 text-gold-bright">0{i + 1}</span>
                {s.caption}
              </figcaption>
            </figure>
          ))}
        </div>

        <div className="reveal mt-20 border-t border-line-dark pt-10 md:mt-28">
          <p className="eyebrow text-paper/50">Worship · Prayer · Community</p>
          <p className="mt-6 max-w-[24ch] font-display text-[clamp(2rem,5.2vw,4.5rem)] leading-[1.02] tracking-[-0.03em] text-paper md:max-w-[30ch]">
            As we gather in one spirit, we quiet our hearts and prepare to connect deeply with our
            Heavenly Father through worship and prayer.
          </p>
          <p className="mt-6 max-w-xl text-[13px] leading-relaxed text-paper/45">
            Quoted verbatim from the description VOBI published alongside its Sunday service
            broadcast.
          </p>
        </div>
      </div>
    </section>
  );
}
