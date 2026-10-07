import type { ReactNode } from "react";

type Props = {
  /**
   * Kept for call-site compatibility. A ministry header does not number its
   * sections, so the numeral is no longer rendered.
   */
  index?: string;
  eyebrow: string;
  title: ReactNode;
  tone?: "solid" | "reverse";
  className?: string;
  aside?: ReactNode;
};

export function SectionHead({
  eyebrow,
  title,
  tone = "solid",
  className = "",
  aside,
}: Props) {
  const dim = tone === "reverse" ? "text-paper/60" : "text-muted";
  const rule = tone === "reverse" ? "bg-gold-bright" : "bg-gold";

  return (
    <div className={`reveal ${className}`}>
      <div className="flex items-center gap-4">
        <span className={`h-px w-10 shrink-0 ${rule}`} aria-hidden />
        <span className={`eyebrow ${dim}`}>{eyebrow}</span>
      </div>
      <div className="mt-6 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <h2 className="display-md max-w-[22ch]">{title}</h2>
        {aside}
      </div>
    </div>
  );
}