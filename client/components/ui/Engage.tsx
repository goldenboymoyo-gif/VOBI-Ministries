"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Avatar } from "@/components/ui/Avatar";
import { storedConsent } from "@/lib/consent";

type C = { id: string; name: string; text: string; at: number; uid?: string };

function ago(t: number) {
  const s = Math.max(1, Math.floor((Date.now() - t) / 1000));
  if (s < 60) return "just now";
  if (s < 3600) return `${Math.floor(s / 60)} min ago`;
  if (s < 86400) return `${Math.floor(s / 3600)} h ago`;
  return new Date(t).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

/** Likes and comments for one video, saved on this site. */
const EMOJI = [
  { icon: "\u{1F600}", list: "\u{1F600} \u{1F603} \u{1F604} \u{1F601} \u{1F606} \u{1F605} \u{1F602} \u{1F923} \u{1F60A} \u{1F607} \u{1F642} \u{1F643} \u{1F609} \u{1F60C} \u{1F60D} \u{1F970} \u{1F618} \u{1F617} \u{1F619} \u{1F61A} \u{1F60B} \u{1F61B} \u{1F61C} \u{1F92A} \u{1F61D} \u{1F917} \u{1F92D} \u{1F914} \u{1F928} \u{1F610} \u{1F611} \u{1F636} \u{1F644} \u{1F60F} \u{1F623} \u{1F625} \u{1F62E} \u{1F62F} \u{1F62A} \u{1F62B} \u{1F971} \u{1F634} \u{1F924} \u{1F612} \u{1F613} \u{1F614} \u{1F615} \u{1F641} \u{1F616} \u{1F61E} \u{1F61F} \u{1F624} \u{1F622} \u{1F62D} \u{1F626} \u{1F627} \u{1F628} \u{1F629} \u{1F92F} \u{1F62C} \u{1F630} \u{1F631} \u{1F975} \u{1F976} \u{1F633} \u{1F635} \u{1F621} \u{1F620} \u{1F92C} \u{1F637} \u{1F912} \u{1F915} \u{1F922} \u{1F92E} \u{1F927} \u{1F60E} \u{1F913} \u{1F9D0} \u{1F973} \u{1F979} \u{1F97A}" },
  { icon: "\u{1F44D}", list: "\u{1F44D} \u{1F44E} \u{1F44F} \u{1F64C} \u{1F91D} \u{1F64F} \u{1F932} \u{1F450} \u{1F4AA} \u{1FAF6} \u{270C}\u{FE0F} \u{1F91E} \u{1F91F} \u{1F918} \u{1F44C} \u{1F90C} \u{1F90F} \u{1F448} \u{1F449} \u{1F446} \u{1F447} \u{261D}\u{FE0F} \u{270B} \u{1F91A} \u{1F590}\u{FE0F} \u{1F596} \u{1F44B} \u{1F919} \u{270D}\u{FE0F} \u{1FAE1} \u{1FAF0} \u{1FAF5} \u{1F64B} \u{1F646} \u{1F647} \u{1F937} \u{1F926} \u{1F483} \u{1F57A} \u{1F6B6} \u{1F3C3}" },
  { icon: "\u{2764}\u{FE0F}", list: "\u{2764}\u{FE0F} \u{1F9E1} \u{1F49B} \u{1F49A} \u{1F499} \u{1F49C} \u{1F5A4} \u{1F90D} \u{1F90E} \u{1F494} \u{2763}\u{FE0F} \u{1F495} \u{1F49E} \u{1F493} \u{1F497} \u{1F496} \u{1F498} \u{1F49D} \u{1F49F} \u{2665}\u{FE0F} \u{1F63B} \u{1F48C} \u{1F339} \u{1F337} \u{1F338} \u{1F33A} \u{1F33B} \u{1F490}" },
  { icon: "\u{1F64F}", list: "\u{1F64F} \u{271D}\u{FE0F} \u{1F54A}\u{FE0F} \u{1F4D6} \u{26EA} \u{2728} \u{1F31F} \u{2B50} \u{1F525} \u{1F308} \u{2600}\u{FE0F} \u{1F305} \u{1F30D} \u{1F33F} \u{1F343} \u{1F56F}\u{FE0F} \u{1F451} \u{1F48E} \u{1F6D0} \u{2601}\u{FE0F} \u{1F319} \u{26A1} \u{1F4A7} \u{1F30A} \u{1F3D4}\u{FE0F} \u{1F64C} \u{1F607} \u{1F47C} \u{1F3B6} \u{1F3B5} \u{1F3A4} \u{1F941} \u{1F3B9} \u{1F3B8} \u{1F3BA} \u{1F3BB}" },
  { icon: "\u{1F389}", list: "\u{1F389} \u{1F38A} \u{1F388} \u{1F381} \u{1F3C6} \u{1F947} \u{1F3C5} \u{1F3AF} \u{2705} \u{2611}\u{FE0F} \u{1F4AF} \u{1F4A5} \u{1F4AB} \u{1F680} \u{1F340} \u{1F382} \u{1F370} \u{1F942} \u{1F37E} \u{1F4E3} \u{1F4E2} \u{1F514} \u{1F4A1} \u{2753} \u{2757} \u{2795} \u{2714}\u{FE0F} \u{1F197} \u{1F199} \u{1F51D} \u{27A1}\u{FE0F} \u{2B06}\u{FE0F} \u{1F1FF}\u{1F1FC} \u{1F1FF}\u{1F1E6} \u{1F1FF}\u{1F1F2} \u{1F1E7}\u{1F1FC} \u{1F1F3}\u{1F1EC} \u{1F1F0}\u{1F1EA} \u{1F1EC}\u{1F1ED}" },
];

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
  const [pick, setPick] = useState(false);
  const [grp, setGrp] = useState(0);
  const [me, setMe] = useState<{ id: string; name: string } | null>(null);
  useEffect(() => { fetch("/api/account", { cache: "no-store" }).then((r) => r.json()).then((j) => setMe(j.user ?? null)).catch(() => {}); }, []);
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
    if (storedConsent()?.preferences) { try { localStorage.setItem(key, "1"); } catch {} }
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
  const needName = false;
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
        <Avatar uid={me?.id} name={me?.name || name || "G"} dark={dark} />
        <div className="min-w-0 flex-1">
          <input name="website" value={hp} onChange={(e) => setHp(e.target.value)} tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />
          <input id={`comment-${videoId}`} name="comment" aria-label="Add a comment" value={text} onChange={(e) => setText(e.target.value)} onFocus={() => setOpen(true)} maxLength={500} placeholder="Add a comment…" className={`w-full border-b bg-transparent px-0 py-2 text-sm outline-none ${field}`} />
          {open && !me && <p className={`mt-2 text-xs ${mute}`}>Commenting as Guest. <Link href="/account" className="underline">Sign in</Link> to comment with your name and photo.</p>}
          {open && pick && (
            <div className={`mt-2 rounded-xl border p-2 ${dark ? "border-white/20" : "border-line"}`}>
              <div className="flex gap-1 border-b border-current/10 pb-1" role="tablist" aria-label="Emoji groups">
                {EMOJI.map((g, n) => (
                  <button key={g.icon} type="button" role="tab" aria-selected={grp === n} onClick={() => setGrp(n)} className={`grid h-9 w-9 place-items-center rounded-lg text-xl ${grp === n ? "bg-black/15" : "hover:bg-black/10"}`}>{g.icon}</button>
                ))}
              </div>
              <div className="mt-2 grid max-h-44 grid-cols-8 gap-0.5 overflow-y-auto sm:grid-cols-10" role="group" aria-label="Emojis">
                {EMOJI[grp].list.split(" ").map((em) => (
                  <button key={em} type="button" onClick={() => setText((t) => (t + em).slice(0, 500))} className="grid h-9 w-9 place-items-center rounded-lg text-[22px] hover:bg-black/10">{em}</button>
                ))}
              </div>
            </div>
          )}
          {open && (
            <div className="mt-3 flex items-center justify-end gap-2">
              <button type="button" onClick={() => setPick((v) => !v)} aria-label="Add an emoji" aria-expanded={pick} className="rounded-full px-3 py-2 text-lg leading-none hover:bg-black/10">{"\u{1F60A}"}</button>
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
            <Avatar uid={c.uid} name={c.name} dark={dark} />
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
