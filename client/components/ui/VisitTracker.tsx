"use client";

import { useEffect } from "react";

/** Counts the visit once per browser session (anonymous, no cookies). */
export function VisitTracker() {
  useEffect(() => {
    try {
      if (sessionStorage.getItem("vobi-visit")) return;
      sessionStorage.setItem("vobi-visit", "1");
    } catch {}
    let ref = "";
    try { ref = document.referrer ? new URL(document.referrer).hostname : ""; if (ref === location.hostname) ref = ""; } catch {}
    fetch("/api/visit", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ path: location.pathname, ref }), keepalive: true }).catch(() => {});
  }, []);
  return null;
}
