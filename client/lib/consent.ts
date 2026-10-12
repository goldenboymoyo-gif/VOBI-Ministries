"use client";

import { useSyncExternalStore } from "react";

export type Consent = { preferences: boolean; media: boolean; at: number };
const KEY = "vobi-consent";
const EVT = "vobi-consent-change";
let cache: { raw: string | null; val: Consent | null } = { raw: "\u0000", val: null };

function read(): Consent | null {
  let raw: string | null = null;
  try { raw = localStorage.getItem(KEY); } catch {}
  if (raw === cache.raw) return cache.val;
  let val: Consent | null = null;
  if (raw === "accepted") val = { preferences: true, media: true, at: 0 };
  else if (raw === "declined") val = { preferences: false, media: false, at: 0 };
  else if (raw) { try { val = JSON.parse(raw) as Consent; } catch {} }
  cache = { raw, val };
  return val;
}

export function saveConsent(c: Omit<Consent, "at">) {
  const full: Consent = { ...c, at: Date.now() };
  try {
    localStorage.setItem(KEY, JSON.stringify(full));
    if (!c.preferences) { localStorage.removeItem("vobi-name"); Object.keys(localStorage).filter((k) => k.startsWith("vobi-like")).forEach((k) => localStorage.removeItem(k)); }
  } catch {}
  window.dispatchEvent(new Event(EVT));
  fetch("/api/account", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "consent", prefs: c }) }).catch(() => {});
}

export const openCookieSettings = () => window.dispatchEvent(new Event("vobi-cookie-open"));
export const storedConsent = () => read();

export function useConsent(): Consent | null | undefined {
  return useSyncExternalStore(
    (cb) => { window.addEventListener(EVT, cb); window.addEventListener("storage", cb); return () => { window.removeEventListener(EVT, cb); window.removeEventListener("storage", cb); }; },
    read,
    () => undefined,
  );
}
