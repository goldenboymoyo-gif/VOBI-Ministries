"use client";

import type { ReactNode } from "react";

import { saveConsent, useConsent } from "@/lib/consent";

/** Shows video only when the visitor allows video cookies; otherwise a one-tap prompt. */
export function MediaGate({ children, className = "aspect-video w-full" }: { children: ReactNode; className?: string }) {
  const c = useConsent();
  if (c === undefined) return <div className={`${className} bg-black`} />;
  if (c?.media) return <>{children}</>;
  return (
    <div className={`${className} grid place-items-center bg-black p-5 text-center text-white`}>
      <div className="max-w-sm">
        <p className="font-semibold">Videos are provided by YouTube</p>
        <p className="mt-2 text-sm text-white/70">YouTube may set cookies when a video loads. Allow video cookies to watch here.</p>
        <button type="button" onClick={() => saveConsent({ preferences: c?.preferences ?? false, media: true })} className="mt-4 rounded-full bg-[#e6c453] px-6 py-2.5 text-sm font-bold text-black">Allow videos</button>
      </div>
    </div>
  );
}
