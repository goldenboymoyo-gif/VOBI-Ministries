"use client";

import { useRouter } from "next/navigation";

/** Returns to the page the visitor came from (or Home if they landed here directly). */
export function BackButton() {
  const r = useRouter();
  return (
    <button type="button" onClick={() => { if (window.history.length > 1) r.back(); else r.push("/"); }}
      className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-semibold text-white backdrop-blur hover:bg-white/25">
      <svg viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current" strokeWidth="2.5" aria-hidden><path d="M15 5l-7 7 7 7" /></svg>
      Back
    </button>
  );
}
