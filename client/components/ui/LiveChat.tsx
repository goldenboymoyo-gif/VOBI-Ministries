"use client";

import { useEffect, useRef, useState } from "react";

type M = { id: string; name: string; text: string; at: number };

const hue = (s: string) => { let h = 0; for (const c of s) h = (h * 31 + c.charCodeAt(0)) % 360; return h; };

/** YouTube-style live chat panel. Messages are saved on this site. */
export function LiveChat({ className = "" }: { className?: string }) {
  const [msgs, setMsgs] = useState<M[]>([]);
  const [off, setOff] = useState(false);
  const [name, setName] = useState("");
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState("");
  const [err, setErr] = useState("");
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try { setName(localStorage.getItem("vobi-name") ?? ""); } catch {}
    let dead = false;
    async function pull() {
      try {
        const r = await fetch("/api/chat", { cache: "no-store" });
        if (!r.ok) return setOff(true);
        const j = await r.json(); if (!dead) setMsgs(j.messages);
      } catch {}
    }
    void pull();
    const iv = window.setInterval(pull, 3000);
    return () => { dead = true; window.clearInterval(iv); };
  }, []);

  useEffect(() => { box.current?.scrollTo({ top: box.current.scrollHeight }); }, [msgs.length]);

  async function send(e: React.FormEvent) {
    e.preventDefault(); const t = text.trim(); if (!t) return;
    if (!name.trim()) { setEditing(true); return; }
    setText(""); setErr("");
    const r = await fetch("/api/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, text: t }) });
    const j = await r.json().catch(() => ({}));
    if (r.ok && j.message) setMsgs((m) => [...m, j.message]); else setErr(j.error ?? "Could not send");
  }

  function saveName(v: string) { setName(v); try { localStorage.setItem("vobi-name", v); } catch {} }

  if (off) return null;
  const needName = editing || !name.trim();
  return (
    <aside className={`flex flex-col overflow-hidden rounded-xl border border-white/15 bg-[#0f0f0f] text-white ${className}`} aria-label="Live chat">
      <div className="flex items-center justify-between border-b border-white/15 px-4 py-3">
        <p className="text-sm font-semibold">Live chat</p>
        <p className="text-xs text-white/50">Top chat</p>
      </div>
      <div ref={box} className="min-h-0 flex-1 space-y-2.5 overflow-y-auto px-4 py-3">
        {msgs.length === 0 && <p className="text-sm text-white/50">Welcome to live chat. Say hello.</p>}
        {msgs.map((m) => (
          <p key={m.id} className="flex gap-2.5 break-words text-[13.5px] leading-snug">
            <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full text-[11px] font-bold" style={{ background: `hsl(${hue(m.name)} 55% 38%)` }}>{m.name.slice(0, 1).toUpperCase()}</span>
            <span><span className="mr-2 font-semibold text-white/60">{m.name}</span><span>{m.text}</span></span>
          </p>
        ))}
      </div>
      <form onSubmit={send} className="border-t border-white/15 p-3">
        {needName ? (
          <div className="mb-2 flex gap-2">
            <input value={name} onChange={(e) => saveName(e.target.value)} maxLength={30} placeholder="Your name to chat" autoFocus className="min-w-0 flex-1 rounded-full bg-white/10 px-4 py-2 text-sm outline-none placeholder:text-white/40 focus:bg-white/15" />
            {name.trim() && <button type="button" onClick={() => setEditing(false)} className="rounded-full bg-white/15 px-4 text-sm font-semibold">OK</button>}
          </div>
        ) : (
          <p className="mb-2 text-xs text-white/50">Chatting as <b className="text-white/80">{name}</b> · <button type="button" onClick={() => setEditing(true)} className="underline">change</button></p>
        )}
        <div className="flex items-center gap-2">
          <input value={text} onChange={(e) => setText(e.target.value)} maxLength={200} placeholder="Chat…" className="min-w-0 flex-1 rounded-full bg-white/10 px-4 py-2.5 text-sm outline-none placeholder:text-white/40 focus:bg-white/15" />
          <button type="submit" disabled={!text.trim()} aria-label="Send" className="grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white transition hover:bg-white/20 disabled:opacity-40">
            <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden><path d="M2 21l21-9L2 3v7l15 2-15 2z" /></svg>
          </button>
        </div>
        {err && <p className="mt-2 text-xs text-red-400">{err}</p>}
      </form>
    </aside>
  );
}
