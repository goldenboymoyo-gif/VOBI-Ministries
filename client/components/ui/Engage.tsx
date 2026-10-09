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
export function Engage({ videoId, className = "" }: { videoId: string; className?: string }) {
  const [likes, setLikes] = useState(0);
  const [comments, setComments] = useState<C[]>([]);
  const [off, setOff] = useState(false);
  const [liked, setLiked] = useState(false);
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [hp, setHp] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
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
  return (
    <section className={className} aria-label="Likes and comments">
      <div className="flex items-center gap-4 border-b border-line pb-4">
        <button type="button" onClick={like} aria-pressed={liked}
          className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold transition-colors ${liked ? "bg-gold-bright text-ink" : "bg-white text-ink shadow-sm hover:bg-gold-bright"}`}>
          <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden><path d="M2 21h4V9H2v12zM23 10a2 2 0 0 0-2-2h-6.3l1-4.6v-.3a1.5 1.5 0 0 0-.4-1L14.2 1 7.6 7.6A2 2 0 0 0 7 9v10a2 2 0 0 0 2 2h9a2 2 0 0 0 1.8-1.2l3-7A2 2 0 0 0 23 12v-2z" /></svg>
          {likes} {likes === 1 ? "Like" : "Likes"}
        </button>
        <p className="text-sm font-semibold text-muted">{comments.length} {comments.length === 1 ? "comment" : "comments"}</p>
      </div>
      <form onSubmit={send} className="mt-5 grid gap-3">
        <input value={name} onChange={(e) => setName(e.target.value)} maxLength={40} placeholder="Your name" className="rounded border border-line bg-white px-4 py-3 text-sm" />
        <input value={hp} onChange={(e) => setHp(e.target.value)} tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />
        <textarea value={text} onChange={(e) => setText(e.target.value)} maxLength={500} rows={3} placeholder="Add a comment…" className="rounded border border-line bg-white px-4 py-3 text-sm" />
        <div className="flex items-center gap-4">
          <button type="submit" disabled={busy || !text.trim()} className="btn btn-ink disabled:opacity-50">Comment</button>
          {err && <p className="text-sm text-red-600">{err}</p>}
        </div>
      </form>
      <ul className="mt-6 space-y-5">
        {comments.map((c) => (
          <li key={c.id} className="flex gap-3">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gold-bright text-sm font-bold text-ink">{c.name.slice(0, 1).toUpperCase()}</span>
            <div>
              <p className="text-sm"><span className="font-bold">{c.name}</span> <span className="text-muted">· {ago(c.at)}</span></p>
              <p className="mt-0.5 whitespace-pre-wrap break-words text-[15px]">{c.text}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
