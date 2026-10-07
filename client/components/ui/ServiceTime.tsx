import { site } from "@/config/site";

/**
 * The service time VOBI supplied, held in one place so every page agrees.
 * Renders nothing until a time exists — it never guesses one.
 */
export function ServiceTime({ className = "" }: { className?: string }) {
  const { day, time, note } = site.service;
  if (!time) return null;

  return (
    <span className={`block ${className}`}>
      <span className="font-display text-[1.35rem] leading-none tracking-[-0.02em]">
        {[day, time].filter(Boolean).join(" · ")}
      </span>
      {note && <span className="mt-2 block text-[14px] leading-relaxed">{note}</span>}
    </span>
  );
}
