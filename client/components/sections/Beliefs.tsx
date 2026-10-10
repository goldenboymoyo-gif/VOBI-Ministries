/* eslint-disable @next/next/no-img-element */
type Belief = { t: string; d: string };

const PHOTOS = ["word", "prayer", "spirit", "healing", "church", "salvation"].map((n) => `/beliefs/${n}.jpg`);

function pick(t: string, i: number): { src: string; pos: string } {
  const s = t.toLowerCase();
  if (/word|scripture|bible|truth|teaching/.test(s)) return { src: PHOTOS[0], pos: "50% 30%" };
  if (/prayer|pray/.test(s)) return { src: PHOTOS[1], pos: "50% 25%" };
  if (/spirit|worship|praise/.test(s)) return { src: PHOTOS[2], pos: "50% 30%" };
  if (/heal|deliver/.test(s)) return { src: PHOTOS[3], pos: "40% 35%" };
  if (/church|everywhere|family|together/.test(s)) return { src: PHOTOS[4], pos: "50% 50%" };
  if (/salvation|christ|saved|cross|grace/.test(s)) return { src: PHOTOS[5], pos: "50% 45%" };
  return { src: PHOTOS[i % PHOTOS.length], pos: "50% 35%" };
}

export function Beliefs({ beliefs }: { beliefs: Belief[] }) {
  return (
    <section id="faith" className="bg-ink py-14 text-white md:py-24">
      <div className="shell">
        <div className="max-w-2xl">
          <p className="eyebrow text-gold-bright">Our faith</p>
          <h2 className="mt-2 text-3xl font-extrabold uppercase md:text-4xl">What we believe</h2>
          <p className="mt-4 leading-relaxed text-white/70">The truths we stand on, taken from the Word of God.</p>
        </div>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 md:mt-12 md:gap-8 lg:grid-cols-3">
          {beliefs.map((b, i) => {
            const v = pick(b.t, i);
            return (
              <article key={b.t} className="reveal overflow-hidden rounded-2xl bg-ink-800 ring-1 ring-white/10">
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img src={v.src} alt="" loading="lazy" className="h-full w-full object-cover" style={{ objectPosition: v.pos }} />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink-900/85 via-transparent to-transparent" />
                  <h3 className="absolute bottom-3 left-4 right-4 text-xl font-extrabold text-gold-bright md:bottom-4 md:left-5">{b.t}</h3>
                </div>
                <p className="p-5 leading-relaxed text-white/80 md:p-6">{b.d}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
