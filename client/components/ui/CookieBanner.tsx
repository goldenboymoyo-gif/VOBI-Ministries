"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { saveConsent, storedConsent, useConsent } from "@/lib/consent";

const CATS = [
  { k: "necessary", t: "Strictly necessary", d: "Keeps the site working: your sign-in session if you create an account for the live chat, and your cookie choice. These cannot be switched off." },
  { k: "preferences", t: "Preferences", d: "Remembers on this device which videos you have liked and the details you typed, so you do not have to repeat them." },
  { k: "media", t: "Videos (YouTube)", d: "Lets VOBI TV, sermons and the live service play. YouTube may set its own cookies when a video loads. If off, you can still allow a single video when you want to watch." },
] as const;

/** Cookie notice with a preference centre: visitors choose which categories to allow. */
export function CookieBanner() {
  const consent = useConsent();
  const [panel, setPanel] = useState(false);
  const [prefs, setPrefs] = useState({ preferences: false, media: false });

  useEffect(() => {
    const open = () => { const c = storedConsent(); setPrefs({ preferences: c?.preferences ?? false, media: c?.media ?? false }); setPanel(true); };
    window.addEventListener("vobi-cookie-open", open);
    return () => window.removeEventListener("vobi-cookie-open", open);
  }, []);

  const done = (c: { preferences: boolean; media: boolean }) => { saveConsent(c); setPanel(false); };
  if (consent === undefined || (consent && !panel)) return null;

  if (panel) {
    return (
      <div role="dialog" aria-modal="true" aria-label="Cookie preferences" className="fixed inset-0 z-[110] grid place-items-end bg-black/60 sm:place-items-center">
        <div className="max-h-[92dvh] w-full overflow-y-auto rounded-t-2xl bg-paper p-5 text-ink shadow-2xl sm:max-w-lg sm:rounded-2xl sm:p-7">
          <h2 className="text-xl font-extrabold">Cookie preferences</h2>
          <p className="mt-2 text-sm leading-relaxed text-ink/70">Choose which cookies and similar storage you allow. You can change this at any time from “Cookie settings” in the footer. See our <Link href="/cookies" className="underline">Cookie Policy</Link>.</p>
          <div className="mt-5 space-y-3">
            {CATS.map((c) => {
              const locked = c.k === "necessary";
              const on = locked || prefs[c.k as "preferences" | "media"];
              return (
                <div key={c.k} className="flex items-start gap-4 rounded-xl border border-ink/10 bg-white p-4">
                  <div className="flex-1"><p className="font-bold">{c.t}</p><p className="mt-1 text-sm leading-snug text-ink/70">{c.d}</p></div>
                  <button type="button" role="switch" aria-checked={on} aria-label={c.t} disabled={locked}
                    onClick={() => setPrefs({ ...prefs, [c.k]: !on })}
                    className={`relative mt-1 h-7 w-12 shrink-0 rounded-full transition ${on ? "bg-ink" : "bg-ink/25"} ${locked ? "opacity-60" : ""}`}>
                    <span className={`absolute top-0.5 h-6 w-6 rounded-full bg-white transition-all ${on ? "left-[22px]" : "left-0.5"}`} />
                  </button>
                </div>
              );
            })}
          </div>
          <div className="mt-6 flex flex-col gap-2 sm:flex-row">
            <button type="button" onClick={() => done({ preferences: false, media: false })} className="rounded-full border border-ink/30 px-5 py-3 text-sm font-semibold sm:flex-1">Reject non-essential</button>
            <button type="button" onClick={() => done(prefs)} className="rounded-full bg-ink px-5 py-3 text-sm font-bold text-white sm:flex-1">Save my choices</button>
            <button type="button" onClick={() => done({ preferences: true, media: true })} className="rounded-full bg-[#e6c453] px-5 py-3 text-sm font-bold text-black sm:flex-1">Accept all</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div role="dialog" aria-label="Cookie notice" className="fixed inset-x-0 bottom-0 z-[90] border-t border-white/15 bg-ink/97 p-4 text-white shadow-2xl backdrop-blur sm:p-5">
      <div className="mx-auto flex max-w-5xl flex-col gap-4 lg:flex-row lg:items-center">
        <div className="flex-1">
          <p className="font-bold">We value your privacy</p>
          <p className="mt-1 text-sm leading-snug text-white/75">We use cookies that are strictly necessary to run this site. With your permission we also use preference and video cookies to remember your choices and play YouTube videos. Choose what you allow. <Link href="/cookies" className="underline">Cookie Policy</Link></p>
        </div>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:flex lg:shrink-0">
          <button type="button" onClick={() => { const c = storedConsent(); setPrefs({ preferences: c?.preferences ?? false, media: c?.media ?? false }); setPanel(true); }} className="rounded-full border border-white/40 px-5 py-2.5 text-sm font-semibold">Manage preferences</button>
          <button type="button" onClick={() => done({ preferences: false, media: false })} className="rounded-full border border-white/40 px-5 py-2.5 text-sm font-semibold">Reject non-essential</button>
          <button type="button" onClick={() => done({ preferences: true, media: true })} className="rounded-full bg-[#e6c453] px-5 py-2.5 text-sm font-bold text-black">Accept all</button>
        </div>
      </div>
    </div>
  );
}
