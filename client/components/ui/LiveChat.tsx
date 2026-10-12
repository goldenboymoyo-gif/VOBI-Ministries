"use client";

import { useEffect, useRef, useState } from "react";

import { AccountForm, type Me } from "@/components/ui/AccountForm";

type M = { id: string; name: string; text: string; at: number; u?: string };

const hue = (s: string) => { let h = 0; for (const c of s) h = (h * 31 + c.charCodeAt(0)) % 360; return h; };

/** YouTube-style live chat panel. Chatting needs a free account; messages that break the rules are reported to the admin. */
export function LiveChat({ className = "", session = "live" }: { className?: string; session?: string }) {
  const [msgs, setMsgs] = useState<M[]>([]);
  const [off, setOff] = useState(false);
  const [me, setMe] = useState<Me | null>(null);
  const [ready, setReady] = useState(false);
  const [text, setText] = useState("");
  const [err, setErr] = useState("");
  const [note, setNote] = useState("");
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/account", { cache: "no-store" }).then((r) => r.json()).then((j) => setMe(j.user ?? null)).catch(() => {}).finally(() => setReady(true));
  }, []);

  useEffect(() => {
    setMsgs([]);
    let dead = false;
    async function pull() {
      try {
        const r = await fetch(`/api/chat?s=${encodeURIComponent(session)}`, { cache: "no-store" });
        if (!r.ok) return setOff(true);
        const j = await r.json(); if (!dead) setMsgs(j.messages);
      } catch {}
    }
    void pull();
    const iv = window.setInterval(pull, 3000);
    return () => { dead = true; window.clearInterval(iv); };
  }, [session]);

  useEffect(() => { box.current?.scrollTo({ top: box.current.scrollHeight }); }, [msgs.length]);

  async function send(e: React.FormEvent) {
    e.preventDefault(); const t = text.trim(); if (!t) return;
    setText(""); setErr("");
    const r = await fetch("/api/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ text: t, s: session }) });
    const j = await r.json().catch(() => ({}));
    if (r.ok && j.message) setMsgs((m) => [...m, j.message]); else { setErr(j.error ?? "Could not send"); if (r.status === 401) setMe(null); }
  }

  async function report(id: string) {
    if (!confirm("Report this message to the ministry?")) return;
    const r = await fetch("/api/chat/report", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    setNote(r.ok ? "Thank you. The ministry has been notified." : "Could not report. Try again.");
    window.setTimeout(() => setNote(""), 4000);
  }

  async function logout() {
    await fetch("/api/account", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "logout" }) });
    setMe(null);
  }

  if (off) return null;
  return (
    <aside className={`flex flex-col overflow-hidden border-white/15 bg-[#0f0f0f] text-white md:rounded-xl md:border ${className}`} aria-label="Live chat">
      <div className="flex items-center justify-between border-y border-white/15 px-4 py-3 md:border-t-0">
        <p className="text-sm font-semibold">Live chat</p>
        <p className="text-xs text-white/50">Top chat</p>
      </div>
      <div ref={box} className="min-h-0 flex-1 space-y-2.5 overflow-y-auto px-4 py-3">
        {msgs.length === 0 && <p className="text-sm text-white/50">Welcome to live chat. Say hello.</p>}
        {msgs.map((m) => (
          <p key={m.id} className="group flex gap-2.5 break-words text-[13.5px] leading-snug">
            <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full text-[11px] font-bold" style={{ background: `hsl(${hue(m.name)} 55% 38%)` }}>{m.name.slice(0, 1).toUpperCase()}</span>
            <span className="min-w-0 flex-1"><span className="mr-2 font-semibold text-white/60">{m.name}</span><span>{m.text}</span></span>
            {me && m.u !== me.id.slice(0, 4) && (
              <button type="button" onClick={() => report(m.id)} aria-label="Report message" title="Report" className="shrink-0 self-start text-white/30 hover:text-white/80">
                <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden><path d="M5 3v18h2v-7h12l-2-4 2-4H7V3z" /></svg>
              </button>
            )}
          </p>
        ))}
      </div>
      {note && <p className="border-t border-white/15 px-4 py-2 text-xs text-[#e6c453]">{note}</p>}
      {!ready ? null : !me ? (
        <div className="max-h-[70%] overflow-y-auto border-t border-white/15"><AccountForm onDone={setMe} /></div>
      ) : (
        <form onSubmit={send} className="border-t border-white/15 p-3">
          <p className="mb-2 text-xs text-white/50">Chatting as <b className="text-white/80">{me.name}</b> · <button type="button" onClick={logout} className="underline">log out</button></p>
          <div className="flex items-center gap-2">
            <input id="live-chat-input" name="chat" aria-label="Chat message" value={text} onChange={(e) => setText(e.target.value)} maxLength={200} placeholder="Chat…" className="min-w-0 flex-1 rounded-full bg-white/10 px-4 py-2.5 text-sm outline-none placeholder:text-white/40 focus:bg-white/15" />
            <button type="submit" disabled={!text.trim()} aria-label="Send" className="grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white transition hover:bg-white/20 disabled:opacity-40">
              <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden><path d="M2 21l21-9L2 3v7l15 2-15 2z" /></svg>
            </button>
          </div>
          {err && <p className="mt-2 text-xs text-red-400">{err}</p>}
        </form>
      )}
    </aside>
  );
}
