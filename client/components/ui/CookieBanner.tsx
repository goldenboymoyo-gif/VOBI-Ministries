"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const KEY = "vobi-consent";

/** Cookie choice: accept or decline. Declining keeps only what is strictly needed. */
export function CookieBanner() {
  const [show, setShow] = useState(false);
  useEffect(() => { try { if (!localStorage.getItem(KEY)) setShow(true); } catch {} }, []);
  function choose(v: "accepted" | "declined") {
    try { localStorage.setItem(KEY, v); if (v === "declined") { localStorage.removeItem("vobi-name"); } } catch {}
    setShow(false);
    fetch("/api/account", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "consent", value: v }) }).catch(() => {});
  }
  if (!show) return null;
  return (
    <div role="dialog" aria-label="Cookie choice" className="fixed inset-x-0 bottom-0 z-[90] border-t border-white/15 bg-ink/95 p-4 text-white backdrop-blur">
      <div className="mx-auto flex max-w-4xl flex-col gap-3 sm:flex-row sm:items-center">
        <p className="flex-1 text-sm leading-snug text-white/85">We use only the cookies and local storage the site needs, plus optional ones that remember your likes on this device. You can accept or decline. <Link href="/cookies" className="underline">Cookie Policy</Link></p>
        <div className="flex gap-2">
          <button type="button" onClick={() => choose("declined")} className="flex-1 rounded-full border border-white/40 px-5 py-2.5 text-sm font-semibold sm:flex-none">Decline</button>
          <button type="button" onClick={() => choose("accepted")} className="flex-1 rounded-full bg-[#e6c453] px-5 py-2.5 text-sm font-bold text-black sm:flex-none">Accept</button>
        </div>
      </div>
    </div>
  );
}
