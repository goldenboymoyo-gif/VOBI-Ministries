"use client";

import { openCookieSettings } from "@/lib/consent";

export function CookieSettingsLink() {
  return <button type="button" onClick={openCookieSettings} className="hover:text-white">Cookie settings</button>;
}
