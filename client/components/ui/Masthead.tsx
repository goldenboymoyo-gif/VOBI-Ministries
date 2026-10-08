import Link from "next/link";
import type { ReactNode } from "react";

type Crumb = { label: string; href?: string };

type Props = {
  eyebrow: string;
  title: ReactNode;
  intro?: ReactNode;
  crumbs?: Crumb[];
  meta?: ReactNode;
  image?: string;
};

export function Masthead({ eyebrow, title, intro, crumbs = [], meta, image = "/photos/hero.jpg" }: Props) {
  return (
    <header className="relative isolate overflow-hidden bg-ink text-white">
      <div className="absolute inset-0 -z-10" aria-hidden>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={image} alt="" className="kenburns h-full w-full object-cover" />
        <div className="absolute inset-0 bg-ink/65" />
      </div>
      <div className="shell relative pb-14 pt-36 md:pb-20 md:pt-44">
        {crumbs.length > 0 && (
          <nav aria-label="Breadcrumb" className="mb-5 flex flex-wrap items-center gap-2 text-sm italic text-white/70">
            {crumbs.map((c, i) => (
              <span key={`${c.label}-${i}`} className="flex items-center gap-2">
                {i > 0 && <span aria-hidden>/</span>}
                {c.href ? <Link href={c.href} className="hover:text-white">{c.label}</Link> : <span className="text-white">{c.label}</span>}
              </span>
            ))}
          </nav>
        )}
        <p className="eyebrow fade-up text-xl text-white/90">{eyebrow}</p>
        <h1 className="fade-up mt-2 max-w-3xl text-[clamp(1.75rem,4vw,3rem)] font-extrabold uppercase leading-[1.08] text-gold-bright" style={{ animationDelay: "0.12s" }}>
          {title}
        </h1>
        {intro && <p className="fade-up mt-5 max-w-2xl text-lg leading-relaxed text-white/85" style={{ animationDelay: "0.24s" }}>{intro}</p>}
        {meta && <div className="fade-up mt-7" style={{ animationDelay: "0.36s" }}>{meta}</div>}
      </div>
    </header>
  );
}
