import Link from "next/link";
import type { ReactNode } from "react";

type Crumb = { label: string; href?: string };

type Props = {
  eyebrow: string;
  title: ReactNode;
  intro?: ReactNode;
  crumbs?: Crumb[];
  meta?: ReactNode;
};

export function Masthead({ eyebrow, title, intro, crumbs = [], meta }: Props) {
  return (
    <header className="relative bg-ink text-paper">
      <div className="shell relative pb-14 pt-32 md:pb-16 md:pt-44">
        {crumbs.length > 0 && (
          <nav aria-label="Breadcrumb" className="mb-8 flex flex-wrap items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-paper/45">
            {crumbs.map((c, i) => (
              <span key={`${c.label}-${i}`} className="flex items-center gap-2">
                {i > 0 && <span aria-hidden className="opacity-40">/</span>}
                {c.href ? (
                  <Link href={c.href} className="transition-colors hover:text-paper">
                    {c.label}
                  </Link>
                ) : (
                  <span className="text-paper/80">{c.label}</span>
                )}
              </span>
            ))}
          </nav>
        )}

        <p className="eyebrow text-gold-bright">{eyebrow}</p>

        <div className="mt-6 grid gap-8 lg:grid-cols-12 lg:gap-16">
          <h1 className="display-lg max-w-[20ch]">{title}</h1>
          {(intro || meta) && (
            <div className="lg:col-span-5 lg:pt-3">
              {intro && (
                <p className="max-w-xl text-[15px] leading-relaxed text-paper/70 md:text-base">
                  {intro}
                </p>
              )}
              {meta && <div className="mt-6">{meta}</div>}
            </div>
          )}
        </div>
      </div>
      <div className="h-px w-full bg-line-dark" />
    </header>
  );
}
