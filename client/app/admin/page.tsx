"use client";

import { useCallback, useEffect, useState } from "react";

type C = { id: string; name: string; text: string; at: number };
type Ev = { id: string; title: string; date: string; time?: string | null; location?: string | null; description?: string };
type Vid = { id: string; title: string; cat: string };
type Cfg = { heroVideo?: string; heroImage?: string; announcement?: string; aboutWho?: string; videos?: Vid[] };
type Data = { comments: Record<string, C[]>; chat: C[]; likes: Record<string, number> };

export default function AdminPage() {
  const [data, setData] = useState<Data | null>(null);
  const [pw, setPw] = useState("");
  const [msg, setMsg] = useState("");
  const [events, setEvents] = useState<Ev[]>([]);
  const [cfg, setCfg] = useState<Cfg>({});
  const [nv, setNv] = useState({ url: "", title: "", cat: "sermons" });
  const [saved, setSaved] = useState("");
  const loadCfg = useCallback(async () => {
    const r = await fetch("/api/admin/settings", { cache: "no-store" });
    if (r.ok) setCfg((await r.json()).settings);
  }, []);
  async function post(body: object) {
    const r = await fetch("/api/admin/settings", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    const j = await r.json().catch(() => ({}));
    if (r.ok) { setCfg(j.settings); return true; }
    alert(j.error ?? "Could not save"); return false;
  }
  async function saveCfg(e: React.FormEvent) {
    e.preventDefault();
    if (await post({ action: "save", ...cfg })) { setSaved("Saved. The site updates within a minute or two."); window.setTimeout(() => setSaved(""), 5000); }
  }
  async function addVideo(e: React.FormEvent) {
    e.preventDefault();
    if (await post({ action: "addVideo", ...nv })) setNv({ url: "", title: "", cat: nv.cat });
  }
  const [f, setF] = useState({ title: "", date: "", time: "", location: "", description: "" });
  const loadEvents = useCallback(async () => {
    const r = await fetch("/api/admin/events", { cache: "no-store" });
    if (r.ok) setEvents((await r.json()).events);
  }, []);
  async function addEvent(e: React.FormEvent) {
    e.preventDefault();
    const r = await fetch("/api/admin/events", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(f) });
    if (r.ok) { setF({ title: "", date: "", time: "", location: "", description: "" }); void loadEvents(); } else alert((await r.json().catch(() => ({}))).error ?? "Could not save");
  }
  async function delEvent(id: string) {
    if (!confirm("Delete this event?")) return;
    await fetch("/api/admin/events", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    void loadEvents();
  }

  const load = useCallback(async () => {
    const r = await fetch("/api/admin/data", { cache: "no-store" });
    if (r.ok) setData(await r.json()); else setData(null);
  }, []);
  useEffect(() => { void load(); void loadEvents(); void loadCfg(); }, [load, loadEvents, loadCfg]);

  async function login(e: React.FormEvent) {
    e.preventDefault(); setMsg("");
    const r = await fetch("/api/admin/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password: pw }) });
    if (r.ok) { setPw(""); void load(); } else setMsg((await r.json().catch(() => ({}))).error ?? "Could not sign in");
  }
  async function del(body: object) {
    if (!confirm("Delete this?")) return;
    await fetch("/api/admin/data", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    void load();
  }

  if (!data) {
    return (
      <main className="grid min-h-[70vh] place-items-center bg-paper px-4 pt-32">
        <form onSubmit={login} className="w-full max-w-sm space-y-4 bg-white p-8 shadow-lg">
          <h1 className="text-2xl font-extrabold uppercase">VOBI admin</h1>
          <input type="password" value={pw} onChange={(e) => setPw(e.target.value)} placeholder="Password" className="w-full rounded border border-line px-4 py-3" />
          <button className="btn btn-ink w-full justify-center" type="submit">Sign in</button>
          {msg && <p className="text-sm text-red-600">{msg}</p>}
        </form>
      </main>
    );
  }
  const vids = Object.keys(data.comments);
  return (
    <main className="bg-paper px-4 pb-20 pt-36">
      <div className="mx-auto max-w-4xl space-y-12">
        <h1 className="text-3xl font-extrabold uppercase">Manage the site</h1>
        <section>
          <h2 className="text-xl font-bold">Home page and About</h2>
          <form onSubmit={saveCfg} className="mt-3 grid gap-3 bg-white p-5 shadow-sm">
            <label className="text-sm font-semibold">Hero video (YouTube link)
              <input value={cfg.heroVideo ?? ""} onChange={(e) => setCfg({ ...cfg, heroVideo: e.target.value })} placeholder="https://www.youtube.com/watch?v=..." className="mt-1 w-full rounded border border-line px-3 py-2 font-normal" />
            </label>
            <label className="text-sm font-semibold">Hero picture (image link starting with https://)
              <input value={cfg.heroImage ?? ""} onChange={(e) => setCfg({ ...cfg, heroImage: e.target.value })} placeholder="https://..." className="mt-1 w-full rounded border border-line px-3 py-2 font-normal" />
            </label>
            <label className="text-sm font-semibold">Announcement bar on the home page (leave empty to hide)
              <input value={cfg.announcement ?? ""} onChange={(e) => setCfg({ ...cfg, announcement: e.target.value })} maxLength={200} className="mt-1 w-full rounded border border-line px-3 py-2 font-normal" />
            </label>
            <label className="text-sm font-semibold">About page, “Who we are” text (separate paragraphs with a blank line; leave empty for the default)
              <textarea value={cfg.aboutWho ?? ""} onChange={(e) => setCfg({ ...cfg, aboutWho: e.target.value })} rows={6} className="mt-1 w-full rounded border border-line px-3 py-2 font-normal" />
            </label>
            <div className="flex items-center gap-4"><button className="btn btn-ink" type="submit">Save</button>{saved && <p className="text-sm text-green-700">{saved}</p>}</div>
          </form>
        </section>
        <section>
          <h2 className="text-xl font-bold">Videos on VOBI TV</h2>
          <form onSubmit={addVideo} className="mt-3 grid gap-3 bg-white p-5 shadow-sm md:grid-cols-2">
            <input required value={nv.url} onChange={(e) => setNv({ ...nv, url: e.target.value })} placeholder="YouTube link" className="rounded border border-line px-3 py-2 md:col-span-2" />
            <input required value={nv.title} onChange={(e) => setNv({ ...nv, title: e.target.value })} placeholder="Title" className="rounded border border-line px-3 py-2" />
            <select value={nv.cat} onChange={(e) => setNv({ ...nv, cat: e.target.value })} className="rounded border border-line px-3 py-2">
              <option value="sermons">Sermons</option><option value="testimony">Testimony</option><option value="prophecy">Prophecy</option>
              <option value="massprayer">Mass Prayer</option><option value="funny">Funny Moments</option>
            </select>
            <button className="btn btn-ink md:col-span-2" type="submit">Add video</button>
          </form>
          <ul className="mt-3 divide-y divide-line bg-white shadow-sm">
            {(cfg.videos ?? []).map((v) => (
              <li key={v.id} className="flex items-start justify-between gap-4 p-4 text-sm">
                <span><b>{v.title}</b> · {v.cat}</span>
                <button type="button" onClick={async () => { if (confirm("Remove this video?")) await post({ action: "removeVideo", id: v.id }); }} className="shrink-0 font-bold text-red-600">Remove</button>
              </li>
            ))}
            {!(cfg.videos ?? []).length && <li className="p-4 text-sm text-muted">No videos added here yet.</li>}
          </ul>
        </section>
        <section>
          <h2 className="text-xl font-bold">Events</h2>
          <form onSubmit={addEvent} className="mt-3 grid gap-3 bg-white p-5 shadow-sm md:grid-cols-2">
            <input required value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} placeholder="Event title" className="rounded border border-line px-3 py-2 md:col-span-2" />
            <input required type="date" value={f.date} onChange={(e) => setF({ ...f, date: e.target.value })} className="rounded border border-line px-3 py-2" />
            <input value={f.time} onChange={(e) => setF({ ...f, time: e.target.value })} placeholder="Time, e.g. 08:30" className="rounded border border-line px-3 py-2" />
            <input value={f.location} onChange={(e) => setF({ ...f, location: e.target.value })} placeholder="Place" className="rounded border border-line px-3 py-2 md:col-span-2" />
            <textarea value={f.description} onChange={(e) => setF({ ...f, description: e.target.value })} placeholder="Short description" rows={2} className="rounded border border-line px-3 py-2 md:col-span-2" />
            <button className="btn btn-ink md:col-span-2" type="submit">Add event</button>
          </form>
          <ul className="mt-3 divide-y divide-line bg-white shadow-sm">
            {events.map((ev) => (
              <li key={ev.id} className="flex items-start justify-between gap-4 p-4 text-sm">
                <span><b>{ev.title}</b> · {ev.date}{ev.time ? ` ${ev.time}` : ""}</span>
                <button onClick={() => delEvent(ev.id)} className="shrink-0 font-bold text-red-600">Delete</button>
              </li>
            ))}
            {!events.length && <li className="p-4 text-sm text-muted">No events added here yet.</li>}
          </ul>
        </section>
        <section>
          <h2 className="text-xl font-bold">Likes</h2>
          <ul className="mt-3 text-sm text-muted">{Object.entries(data.likes).map(([v, n]) => <li key={v}>{v}: {n}</li>)}{!Object.keys(data.likes).length && <li>None yet.</li>}</ul>
        </section>
        <section>
          <h2 className="text-xl font-bold">Comments</h2>
          {vids.every((v) => !data.comments[v].length) && <p className="mt-3 text-sm text-muted">No comments yet.</p>}
          {vids.map((v) => data.comments[v].length > 0 && (
            <div key={v} className="mt-5">
              <p className="text-sm font-bold text-gold">Video {v}</p>
              <ul className="mt-2 divide-y divide-line bg-white shadow-sm">
                {data.comments[v].slice().reverse().map((c) => (
                  <li key={c.id} className="flex items-start justify-between gap-4 p-4 text-sm">
                    <span><b>{c.name}</b>: {c.text}</span>
                    <button onClick={() => del({ kind: "comment", video: v, id: c.id })} className="shrink-0 font-bold text-red-600">Delete</button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>
        <section>
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Live chat</h2>
            <button onClick={() => del({ kind: "chat-all" })} className="text-sm font-bold text-red-600">Clear all</button>
          </div>
          <ul className="mt-3 divide-y divide-line bg-white shadow-sm">
            {data.chat.slice().reverse().map((m) => (
              <li key={m.id} className="flex items-start justify-between gap-4 p-4 text-sm">
                <span><b>{m.name}</b>: {m.text}</span>
                <button onClick={() => del({ kind: "chat", id: m.id })} className="shrink-0 font-bold text-red-600">Delete</button>
              </li>
            ))}
            {!data.chat.length && <li className="p-4 text-sm text-muted">No messages yet.</li>}
          </ul>
        </section>
      </div>
    </main>
  );
}
