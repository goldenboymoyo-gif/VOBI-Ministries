"use client";

import { useState } from "react";

/** A member's picture (uploaded, or the one their email uses), or their first letter when there is none. */
export function Avatar({ uid, name, className = "h-10 w-10", dark = false }: { uid?: string; name: string; className?: string; dark?: boolean }) {
  const [bad, setBad] = useState(false);
  const shell = `grid shrink-0 place-items-center overflow-hidden rounded-full text-sm font-bold ${dark ? "bg-white/15" : "bg-gold-bright text-ink"} ${className}`;
  if (!uid || bad) return <span className={shell}>{(Array.from(name)[0] ?? "G").toUpperCase()}</span>;
  // eslint-disable-next-line @next/next/no-img-element
  return <span className={shell}><img src={`/api/avatar/${uid}`} alt="" className="h-full w-full object-cover" onError={() => setBad(true)} /></span>;
}
