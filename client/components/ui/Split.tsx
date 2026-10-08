import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

type Props = {
  image: string;
  alt: string;
  title: string;
  children: ReactNode;
  reverse?: boolean;
  dark?: boolean;
  cta?: { label: string; href: string };
  cta2?: { label: string; href: string };
};

/** Image + text block, alternating sides — the repeating unit of the site. */
export function Split({ image, alt, title, children, reverse, dark, cta, cta2 }: Props) {
  return (
    <section className={dark ? "bg-ink text-paper" : "bg-paper text-ink"}>
      <div className="shell grid items-center gap-10 py-16 md:py-24 lg:grid-cols-2 lg:gap-16">
        <div className={`reveal ${reverse ? "lg:order-2" : ""}`}>
          <div className="frame frame-hover aspect-[4/3]">
            <Image src={image} alt={alt} width={1280} height={960} sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
          </div>
        </div>
        <div className="reveal">
          <h2 className="display-md">{title}</h2>
          <div className={`mt-6 space-y-5 text-[16px] leading-relaxed ${dark ? "text-paper/75" : "text-muted"}`}>{children}</div>
          {(cta || cta2) && (
            <div className="mt-8 flex flex-wrap gap-3">
              {cta && <Link href={cta.href} className={`btn ${dark ? "btn-gold" : "btn-ink"}`}>{cta.label}</Link>}
              {cta2 && <Link href={cta2.href} className={`btn btn-ghost ${dark ? "" : "text-ink"}`}>{cta2.label}</Link>}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
