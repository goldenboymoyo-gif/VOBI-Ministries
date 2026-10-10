"use client";

import { useCallback, useEffect, useState } from "react";

type C = { id: string; name: string; text: string; at: number };

function ago(t: number) {
  const s = Math.max(1, Math.floor((Date.now() - t) / 1000));
  if (s < 60) return "just now";
  if (s < 3600) return `${Math.floor(s / 60)} min ago`;
  if (s < 86400) return `${Math.floor(s / 3600)} h ago`;
  return new Date(t).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

/** Likes and comments for one video, saved on this site. */
export function Engage({ videoId, className = "", dark = false }: { videoId: string; className?: string; dark?: boolean }) {
  const [likes, setLikes] = useState(0);
  const [comments, setComments] = useState<C[]>([]);
  const [off, setOff] = useState(false);
  const [liked, setLiked] = useState(false);
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [hp, setHp] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const [open, setOpen] = useState(false);
  const key = `vobi-liked-${videoId}`;

  const load = useCallback(async () => {
    try {
      const r = await fetch(`/api/engage/${videoId}`, { cache: "no-store" });
      if (!r.ok) return setOff(true);
      const j = await r.json(); setLikes(j.likes); setComments(j.comments);
    } catch { setOff(true); }
  }, [videoId]);

  useEffect(() => {
    void load();
    try { setLiked(localStorage.getItem(key) === "1"); setName(localStorage.getItem("vobi-name") ?? ""); } catch {}
  }, [load, key]);

  async function like() {
    if (liked) return;
    setLiked(true); setLikes((n) => n + 1);
    try { localStorage.setItem(key, "1"); } catch {}
    const r = await fetch(`/api/engage/${videoId}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ type: "like" }) });
    if (r.ok) { const j = await r.json(); setLikes(j.likes); }
  }

  async function send(e: React.FormEvent) {
    e.preventDefault(); if (busy || !text.trim()) return;
    setBusy(true); setErr("");
    try { localStorage.setItem("vobi-name", name); } catch {}
    const r = await fetch(`/api/engage/${videoId}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ type: "comment", name, text, hp }) });
    const j = await r.json().catch(() => ({}));
    if (r.ok && j.comment) { setComments((c) => [j.comment, ...c]); setText(""); } else setErr(j.error ?? "Could not post. Try again.");
    setBusy(false);
  }

  if (off) return null;
  const ink = dark ? "text-white" : "text-ink";
  const mute = dark ? "text-white/60" : "text-muted";
  const field = dark ? "border-white/30 text-white placeholder:text-white/40 focus:border-white" : "border-line text-ink focus:border-ink";
  const needName = !name.trim();
  return (
    <section className={`${className} ${ink}`} aria-label="Likes and comments">
      <div className="flex flex-wrap items-center gap-3">
        <button type="button" onClick={like} aria-pressed={liked}
          className={`inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold transition-colors ${dark ? (liked ? "bg-white text-black" : "bg-white/10 hover:bg-white/20") : (liked ? "bg-gold-bright text-ink" : "bg-white shadow-sm hover:bg-gold-bright")}`}>
          <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden><path d="M2 21h4V9H2v12zM23 10a2 2 0 0 0-2-2h-6.3l1-4.6v-.3a1.5 1.5 0 0 0-.4-1L14.2 1 7.6 7.6A2 2 0 0 0 7 9v10a2 2 0 0 0 2 2h9a2 2 0 0 0 1.8-1.2l3-7A2 2 0 0 0 23 12v-2z" /></svg>
          {likes}
        </button>
      </div>
      <h3 className="mt-6 text-lg font-bold">{comments.length} {comments.length === 1 ? "Comment" : "Comments"}</h3>
      <form onSubmit={send} className="mt-4 flex gap-3">
        <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-full text-sm font-bold ${dark ? "bg-white/15" : "bg-gold-bright text-ink"}`}>{(name || "?").slice(0, 1).toUpperCase()}</span>
        <div className="min-w-0 flex-1">
          {open && needName && <input value={name} onChange={(e) => setName(e.target.value)} maxLength={40} placeholder="Your name" className={`mb-3 w-full border-b bg-transparent px-0 py-2 text-sm outline-none ${field}`} />}
          <input value={hp} onChange={(e) => setHp(e.target.value)} tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />
          <input value={text} onChange={(e) => setText(e.target.value)} onFocus={() => setOpen(true)} maxLength={500} placeholder="Add a comment…" className={`w-full border-b bg-transparent px-0 py-2 text-sm outline-none ${field}`} />
          {open && (
            <div className="mt-3 flex items-center justify-end gap-2">
              {err && <p className="mr-auto text-sm text-red-500">{err}</p>}
              <button type="button" onClick={() => { setOpen(false); setText(""); }} className="rounded-full px-4 py-2 text-sm font-semibold hover:bg-black/10">Cancel</button>
              <button type="submit" disabled={busy || !text.trim() || needName} className={`rounded-full px-4 py-2 text-sm font-semibold disabled:opacity-40 ${dark ? "bg-white text-black" : "bg-ink text-white"}`}>Comment</button>
            </div>
          )}
        </div>
      </form>
      <ul className="mt-7 space-y-6">
        {comments.map((c) => (
          <li key={c.id} className="flex gap-3">
            <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-full text-sm font-bold ${dark ? "bg-white/15" : "bg-gold-bright text-ink"}`}>{c.name.slice(0, 1).toUpperCase()}</span>
            <div>
              <p className="text-[13px]"><span className="font-semibold">@{c.name}</span> <span className={mute}>{ago(c.at)}</span></p>
              <p className="mt-1 whitespace-pre-wrap break-words text-[15px]">{c.text}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
