import type { ReactNode } from "react";

type Props = {
  index: string;
  eyebrow: string;
  title: ReactNode;
  tone?: "solid" | "reverse";
  className?: string;
  aside?: ReactNode;
};

export function SectionHead({
  index,
  eyebrow,
  title,
  tone = "solid",
  className = "",
  aside,
}: Props) {
  const dim = tone === "reverse" ? "text-paper/55" : "text-muted";
  const ruleC = tone === "reverse" ? "bg-line-dark" : "bg-line";

  return (
    <div className={`reveal ${className}`}>
      <div className={`flex items-baseline gap-5 ${dim}`}>
        <span className="numeral text-[11px] tracking-[0.2em]">{index}</span>
        <span className={`h-px w-8 shrink-0 ${ruleC} translate-y-[-3px]`} aria-hidden />
        <span className="eyebrow">{eyebrow}</span>
      </div>
      <div className="mt-6 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <h2 className="display-lg max-w-[14ch]">{title}</h2>
        {aside}
      </div>
    </div>
  );
}
