"use client";

import { useState } from "react";

type Props = {
  /**
   * The supplied mark is a single artwork on a keyed (transparent) background,
   * so tone only decides the colour of the typographic fallback.
   */
  tone?: "solid" | "reverse";
  /** "full" shows the wordmark under the mark; "mark" is compact. */
  variant?: "full" | "mark";
  className?: string;
};

/** Built from images/Logo.jpeg, black background removed, edges re-matted. */
const CANDIDATES: Record<NonNullable<Props["variant"]>, string[]> = {
  mark: ["/brand/logo-mark.png", "/brand/logo.png"],
  full: ["/brand/logo.png", "/brand/logo-mark.png"],
};

/**
 * The real VOBI logo. Nothing here draws, generates or substitutes a mark:
 * it loads the supplied file from /public/brand. If no file has been supplied
 * yet it renders a typographic lockup instead, never an invented symbol.
 */
export function Logo({ tone = "solid", variant = "full", className = "" }: Props) {
  const [failed, setFailed] = useState<Record<string, boolean>>({});
  const src = CANDIDATES[variant].find((p) => !failed[p]);

  if (src) {
    return (
      <span className={`inline-flex items-center ${className}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt="Valley of Blessings International Ministries"
          className={
            variant === "mark"
              ? "h-14 w-auto md:h-[68px]"
              : "h-12 w-auto max-w-[168px] object-contain object-left md:h-14 md:max-w-[210px]"
          }
          onError={() => setFailed((f) => ({ ...f, [src]: true }))}
        />
      </span>
    );
  }

  const ink = tone === "reverse" ? "text-paper" : "text-ink";

  if (variant === "mark") {
    return (
      <span
        className={`font-display text-[1.6rem] leading-none tracking-[-0.04em] ${ink} ${className}`}
        aria-label="Valley of Blessings International Ministries"
      >
        VOBI
      </span>
    );
  }

  return (
    <span className={`inline-flex flex-col leading-none ${ink} ${className}`}>
      <span
        className="font-display text-[1.7rem] leading-none tracking-[-0.045em] md:text-[2rem]"
        aria-label="Valley of Blessings International Ministries"
      >
        VOBI
      </span>
      <span className="mt-[5px] hidden max-w-[164px] text-[7.5px] font-semibold uppercase leading-[1.35] tracking-[0.24em] opacity-70 sm:block md:text-[8px]">
        Valley of Blessings
        <br />
        International Ministries
      </span>
    </span>
  );
}
