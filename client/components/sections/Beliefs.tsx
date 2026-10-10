/* eslint-disable @next/next/no-img-element */
type Belief = { t: string; d: string };

const PHOTOS = ["/photos/worship.jpg", "/photos/praise.jpg", "/photos/congregation.jpg", "/photos/hero.jpg"];

function pick(t: string, i: number): { kind: "bible" | "photo"; src?: string; pos?: string } {
  const s = t.toLowerCase();
  if (/word|scripture|bible|truth|teaching/.test(s)) return { kind: "bible" };
  if (/prayer|pray/.test(s)) return { kind: "photo", src: "/photos/hero.jpg", pos: "50% 30%" };
  if (/spirit|worship|praise/.test(s)) return { kind: "photo", src: "/photos/praise.jpg" };
  if (/heal|deliver/.test(s)) return { kind: "photo", src: "/photos/hero.jpg", pos: "50% 60%" };
  if (/church|everywhere|family|together/.test(s)) return { kind: "photo", src: "/photos/congregation.jpg" };
  if (/salvation|christ|saved|cross|grace/.test(s)) return { kind: "photo", src: "/photos/worship.jpg" };
  return { kind: "photo", src: PHOTOS[i % PHOTOS.length] };
}

/** An open Bible, drawn as a simple illustration so it needs no photo. */
function OpenBible() {
  return (
    <svg viewBox="0 0 400 220" className="h-full w-full" role="img" aria-label="An open Bible">
      <defs>
        <linearGradient id="bb" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#1f2724" /><stop offset="1" stopColor="#0a0d0c" /></linearGradient>
        <radialGradient id="bg" cx="50%" cy="45%" r="55%"><stop offset="0" stopColor="#e6c453" stopOpacity=".38" /><stop offset="1" stopColor="#e6c453" stopOpacity="0" /></radialGradient>
      </defs>
      <rect width="400" height="220" fill="url(#bb)" />
      <rect width="400" height="220" fill="url(#bg)" />
      <path d="M200 70 C160 52 100 52 52 66 L52 168 C100 154 160 154 200 172 Z" fill="#f6efd8" />
      <path d="M200 70 C240 52 300 52 348 66 L348 168 C300 154 240 154 200 172 Z" fill="#efe5c6" />
      <path d="M44 72 L52 66 L52 168 L44 176 Z M356 72 L348 66 L348 168 L356 176 Z" fill="#7d5f12" />
      <path d="M200 70 L200 172" stroke="#b9a15a" strokeWidth="2" />
      <g stroke="#9a8a5a" strokeWidth="2" strokeLinecap="round" opacity=".75">
        {[84, 98, 112, 126, 140].map((y, k) => (
          <g key={y}>
            <path d={`M70 ${y + 2} C100 ${y - 6} 150 ${y - 6} 186 ${y + 6 - k * 0}`} />
            <path d={`M214 ${y + 6} C250 ${y - 6} 300 ${y - 6} 330 ${y + 2}`} />
          </g>
        ))}
      </g>
      <path d="M52 168 C100 154 160 154 200 172 C240 154 300 154 348 168 L348 178 C300 164 240 164 200 182 C160 164 100 164 52 178 Z" fill="#d9ccaa" />
    </svg>
  );
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
                  {v.kind === "bible" ? <OpenBible /> : (
                    <img src={v.src} alt="" loading="lazy" className="h-full w-full object-cover" style={{ objectPosition: v.pos || "50% 40%" }} />
                  )}
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
