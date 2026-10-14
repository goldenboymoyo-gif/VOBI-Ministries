"use client";

import Link from "next/link";
import { useState } from "react";

import { storedConsent } from "@/lib/consent";

export type Me = { id: string; name: string; email: string };

/** Sign up / log in form (used inside the live chat). */
export function AccountForm({ onDone }: { onDone: (u: Me) => void }) {
  const [mode, setMode] = useState<"signup" | "login">("signup");
  const [f, setF] = useState({ name: "", email: "", phone: "", password: "" });
  const [agree, setAgree] = useState(false);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const [photo, setPhoto] = useState("");
  function pickPhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]; if (!file || !file.type.startsWith("image/")) return;
    const img = new window.Image(); const url = URL.createObjectURL(file);
    img.onload = () => {
      const c = document.createElement("canvas"); c.width = c.height = 128;
      const g = c.getContext("2d"); const s = Math.min(img.width, img.height);
      g?.drawImage(img, (img.width - s) / 2, (img.height - s) / 2, s, s, 0, 0, 128, 128);
      setPhoto(c.toDataURL("image/jpeg", 0.8)); URL.revokeObjectURL(url);
    };
    img.src = url;
  }
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement>) => setF({ ...f, [k]: e.target.value });
  const input = "w-full rounded-lg bg-white/10 px-3 py-2.5 text-sm text-white outline-none placeholder:text-white/40 focus:bg-white/15";

  async function submit(e: React.FormEvent) {
    e.preventDefault(); setErr(""); setBusy(true);
    const cookies = storedConsent() ?? undefined;
    try {
      const r = await fetch("/api/account", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: mode, ...f, agree, cookies, photo: mode === "signup" ? photo : undefined }) });
      const j = await r.json().catch(() => ({}));
      if (!r.ok) setErr(j.error ?? "Something went wrong."); else onDone(j.user);
    } catch { setErr("No connection. Try again."); }
    setBusy(false);
  }

  return (
    <form onSubmit={submit} className="space-y-2.5 p-4">
      <p className="text-sm font-semibold">{mode === "signup" ? "Create your VOBI account to join the chat" : "Log in to join the chat"}</p>
      {mode === "signup" && <input className={input} id="acc-name" name="name" placeholder="Full name" value={f.name} onChange={set("name")} maxLength={40} autoComplete="name" required />}
      <input className={input} id="acc-email" name="email" type="email" placeholder="Email address" value={f.email} onChange={set("email")} autoComplete="email" required />
      {mode === "signup" && (
        <label className="flex cursor-pointer items-center gap-3 text-xs text-white/70">
          <span className="grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-full bg-white/10 text-lg">{/* eslint-disable-next-line @next/next/no-img-element */}{photo ? <img src={photo} alt="" className="h-full w-full object-cover" /> : "\u{1F4F7}"}</span>
          <span>Profile photo (optional). If you skip it, we use the picture your email already has.</span>
          <input type="file" accept="image/*" onChange={pickPhoto} className="hidden" />
        </label>
      )}
      {mode === "signup" && <input className={input} id="acc-phone" name="phone" type="tel" placeholder="Phone (optional)" value={f.phone} onChange={set("phone")} autoComplete="tel" />}
      <input className={input} id="acc-password" name="password" type="password" placeholder="Password (8+ characters)" value={f.password} onChange={set("password")} autoComplete={mode === "signup" ? "new-password" : "current-password"} minLength={8} required />
      {mode === "signup" && (
        <label className="flex items-start gap-2 text-xs leading-snug text-white/70">
          <input id="acc-agree" name="agree" type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} className="mt-0.5 h-4 w-4 shrink-0" />
          <span>I accept the <Link href="/privacy" target="_blank" className="underline">Privacy Policy</Link> and agree to keep the chat respectful. Messages that break the rules are reported to the ministry, which may contact me.</span>
        </label>
      )}
      {err && <p className="text-xs text-red-400">{err}</p>}
      <button type="submit" disabled={busy || (mode === "signup" && !agree)} className="w-full rounded-full bg-[#e6c453] py-2.5 text-sm font-bold text-black disabled:opacity-50">{busy ? "Please wait…" : mode === "signup" ? "Sign up" : "Log in"}</button>
      <p className="text-center text-xs text-white/60">
        {mode === "signup" ? "Already have an account?" : "New here?"}{" "}
        <button type="button" className="underline" onClick={() => { setMode(mode === "signup" ? "login" : "signup"); setErr(""); }}>{mode === "signup" ? "Log in" : "Sign up"}</button>
      </p>
    </form>
  );
}
