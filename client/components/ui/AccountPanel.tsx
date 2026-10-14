"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { Avatar } from "@/components/ui/Avatar";
import { AccountForm, type Me } from "@/components/ui/AccountForm";
import { openCookieSettings } from "@/lib/consent";

/** Sign up / log in page body, and a small profile once signed in. */
export function AccountPanel() {
  const [me, setMe] = useState<Me | null>(null);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    fetch("/api/account", { cache: "no-store" }).then((r) => r.json()).then((j) => setMe(j.user ?? null)).catch(() => {}).finally(() => setReady(true));
  }, []);
  async function logout() {
    await fetch("/api/account", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "logout" }) });
    setMe(null);
  }
  return (
    <div className="mx-auto max-w-md overflow-hidden rounded-2xl bg-[#0f0f0f] text-white shadow-xl">
      {!ready ? <p className="p-6 text-sm text-white/60">Loading…</p> : me ? (
        <div className="space-y-4 p-6">
          <Avatar uid={me.id} name={me.name} dark className="h-16 w-16 text-xl" />
          <p className="text-sm text-white/60">Signed in</p>
          <p className="text-xl font-bold">{me.name}</p>
          <p className="text-sm text-white/80">{me.email}</p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Link href="/live" className="btn btn-gold">Join the live chat</Link>
            <button type="button" onClick={logout} className="btn btn-ghost">Log out</button>
          </div>
          <p className="pt-2 text-xs text-white/50"><button type="button" onClick={openCookieSettings} className="underline">Cookie settings</button> · <Link href="/privacy" className="underline">Privacy Policy</Link></p>
        </div>
      ) : <AccountForm onDone={setMe} />}
    </div>
  );
}
