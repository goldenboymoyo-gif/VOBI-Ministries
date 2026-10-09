"use client";

import { useEffect, useRef, useState } from "react";

type M = { id: string; name: string; text: string; at: number };

/** Live chat shown beside the stream. Messages are saved on this site. */
export function LiveChat({ className = "" }: { className?: string }) {
  const [msgs, setMsgs] = useState<M[]>([]);
  const [off, setOff] = useState(false);
  const [name, setName] = useState("");
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
    setText(""); setErr("");
    try { localStorage.setItem("vobi-name", name); } catch {}
    const r = await fetch("/api/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, text: t }) });
    const j = await r.json().catch(() => ({}));
    if (r.ok && j.message) setMsgs((m) => [...m, j.message]); else setErr(j.error ?? "Could not send");
  }

  if (off) return null;
  return (
    <aside className={`flex flex-col overflow-hidden rounded bg-white text-ink shadow-lg ${className}`} aria-label="Live chat">
      <p className="border-b border-line px-4 py-3 text-sm font-bold uppercase tracking-wider">Live chat</p>
      <div ref={box} className="min-h-0 flex-1 space-y-3 overflow-y-auto px-4 py-3">
        {msgs.length === 0 && <p className="text-sm text-muted">Be the first to say hello.</p>}
        {msgs.map((m) => (
          <p key={m.id} className="break-words text-sm leading-snug"><span className="font-bold text-gold">{m.name}</span> {m.text}</p>
        ))}
      </div>
      <form onSubmit={send} className="grid gap-2 border-t border-line p-3">
        <input value={name} onChange={(e) => setName(e.target.value)} maxLength={30} placeholder="Your name" className="rounded border border-line px-3 py-2 text-sm" />
        <div className="flex gap-2">
          <input value={text} onChange={(e) => setText(e.target.value)} maxLength={200} placeholder="Say something…" className="min-w-0 flex-1 rounded border border-line px-3 py-2 text-sm" />
          <button type="submit" className="btn btn-ink !px-4 !py-2">Send</button>
        </div>
        {err && <p className="text-xs text-red-600">{err}</p>}
      </form>
    </aside>
  );
}
