"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

/** Small round account button for the header: a person icon, or the member's initial once signed in. */
export function HeaderAccount({ className = "" }: { className?: string }) {
  const [name, setName] = useState<string | null>(null);
  useEffect(() => {
    fetch("/api/account", { cache: "no-store" }).then((r) => r.json()).then((j) => setName(j.user?.name ?? null)).catch(() => {});
  }, []);
  return (
    <Link href="/account" aria-label={name ? `Your account (${name})` : "Sign in or sign up"} title={name ? name : "Sign in / Sign up"}
      className={`grid h-11 w-11 shrink-0 place-items-center rounded-full border border-current/40 text-sm font-bold transition hover:bg-gold-bright hover:text-ink ${name ? "bg-gold-bright text-ink" : ""} ${className}`}>
      {name ? name.slice(0, 1).toUpperCase() : (
        <svg viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current" strokeWidth="1.8" aria-hidden><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7" /></svg>
      )}
    </Link>
  );
}
