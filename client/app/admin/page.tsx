"use client";

import { useCallback, useEffect, useState } from "react";

type C = { id: string; name: string; text: string; at: number };
type Ev = { id: string; title: string; date: string; time?: string | null; location?: string | null; description?: string };
type Vid = { id: string; title: string; cat: string };
type Row = Record<string, string>;
type Cfg = {
  heroVideo?: string; heroImage?: string; announcement?: string; aboutWho?: string; videos?: Vid[];
  contact?: Row; notes?: Row; [k: string]: unknown;
};
type Field = { k: string; label: string; type: "text" | "area" | "image" };

async function uploadPicture(file: File): Promise<string | null> {
  const img = new Image();
  const src = URL.createObjectURL(file);
  await new Promise<void>((ok, bad) => { img.onload = () => ok(); img.onerror = () => bad(); img.src = src; }).catch(() => undefined);
  if (!img.width) { alert("Could not read that picture"); return null; }
  const sc = Math.min(1, 1920 / Math.max(img.width, img.height));
  const c = document.createElement("canvas"); c.width = Math.round(img.width * sc); c.height = Math.round(img.height * sc);
  c.getContext("2d")?.drawImage(img, 0, 0, c.width, c.height);
  const data = c.toDataURL("image/jpeg", 0.85);
  const r = await fetch("/api/admin/upload", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ data }) });
  const j = await r.json().catch(() => ({}));
  if (!r.ok) { alert(j.error ?? "Upload failed"); return null; }
  return j.url as string;
}

function PictureField({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [busy, setBusy] = useState(false);
  return (
    <div className="mt-1 flex flex-wrap items-center gap-3">
      <input value={value} onChange={(e) => onChange(e.target.value)} placeholder="Upload a picture, or paste a link" className="min-w-0 flex-1 rounded border border-line px-3 py-2 font-normal" />
      <label className="btn btn-ghost cursor-pointer text-ink !px-4 !py-2">
        {busy ? "Uploading…" : "Upload"}
        <input type="file" accept="image/*" className="hidden" onChange={async (e) => {
          const f = e.target.files?.[0]; if (!f) return; setBusy(true);
          const u = await uploadPicture(f); if (u) onChange(u); setBusy(false); e.target.value = "";
        }} />
      </label>
      {value && <img src={value} alt="" className="h-12 w-20 rounded object-cover" />}
    </div>
  );
}

function ListEditor({ title, hint, fields, initial, blank, custom, onSave, onReset }: {
  title: string; hint: string; fields: Field[]; initial: Row[]; blank: Row; custom: boolean;
  onSave: (items: Row[]) => Promise<boolean>; onReset: () => Promise<void>;
}) {
  const [items, setItems] = useState<Row[]>(initial);
  const [msg, setMsg] = useState("");
  const set = (i: number, k: string, v: string) => setItems((a) => a.map((x, n) => (n === i ? { ...x, [k]: v } : x)));
  const move = (i: number, d: number) => setItems((a) => { const b = [...a], j = i + d; if (j < 0 || j >= b.length) return a; [b[i], b[j]] = [b[j], b[i]]; return b; });
  return (
    <section>
      <h2 className="text-xl font-bold">{title}</h2>
      <p className="mt-1 text-sm text-muted">{hint} {custom ? "You have changed this from the original." : "Showing the original. Edit and save to change it."}</p>
      <div className="mt-3 space-y-4">
        {items.map((it, i) => (
          <div key={i} className="grid gap-3 bg-white p-5 shadow-sm">
            {fields.map((f) => (
              <label key={f.k} className="text-sm font-semibold">{f.label}
                {f.type === "text" && <input value={it[f.k] ?? ""} onChange={(e) => set(i, f.k, e.target.value)} className="mt-1 w-full rounded border border-line px-3 py-2 font-normal" />}
                {f.type === "area" && <textarea value={it[f.k] ?? ""} onChange={(e) => set(i, f.k, e.target.value)} rows={4} className="mt-1 w-full rounded border border-line px-3 py-2 font-normal" />}
                {f.type === "image" && <PictureField value={it[f.k] ?? ""} onChange={(v) => set(i, f.k, v)} />}
              </label>
            ))}
            <div className="flex gap-4 text-sm font-bold">
              <button type="button" onClick={() => move(i, -1)}>Move up</button>
              <button type="button" onClick={() => move(i, 1)}>Move down</button>
              <button type="button" className="text-red-600" onClick={() => setItems((a) => a.filter((_, n) => n !== i))}>Remove</button>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button type="button" className="btn btn-ghost text-ink" onClick={() => setItems((a) => [...a, { ...blank }])}>Add one</button>
        <button type="button" className="btn btn-ink" onClick={async () => { if (await onSave(items)) { setMsg("Saved. The site updates within a minute or two."); window.setTimeout(() => setMsg(""), 5000); } }}>Save</button>
        {custom && <button type="button" className="text-sm font-bold text-red-600" onClick={async () => { if (confirm("Go back to the original version?")) await onReset(); }}>Reset to original</button>}
        {msg && <p className="text-sm text-green-700">{msg}</p>}
      </div>
    </section>
  );
}

const toRow = (o: Record<string, unknown>): Row => Object.fromEntries(Object.entries(o).map(([k, v]) => [k, Array.isArray(v) ? v.join("\n\n") : v == null ? "" : String(v)]));
type Data = { comments: Record<string, C[]>; chat: C[]; likes: Record<string, number> };

export default function AdminPage() {
  const [data, setData] = useState<Data | null>(null);
  const [pw, setPw] = useState("");
  const [msg, setMsg] = useState("");
  const [events, setEvents] = useState<Ev[]>([]);
  const [cfg, setCfg] = useState<Cfg>({});
  const [defs, setDefs] = useState<Record<string, unknown>>({});
  const [contact, setContact] = useState<Row>({});
  const [notes, setNotes] = useState<Row>({});
  const [nv, setNv] = useState({ url: "", title: "", cat: "sermons" });
  const [saved, setSaved] = useState("");
  const loadCfg = useCallback(async () => {
    const r = await fetch("/api/admin/settings", { cache: "no-store" });
    if (r.ok) {
      const j = await r.json(); setCfg(j.settings); setDefs(j.defaults);
      setContact({ ...(j.defaults.contact as Row), ...Object.fromEntries(Object.entries((j.settings.contact ?? {}) as Row).filter(([, v]) => v)) });
      setNotes((j.settings.notes ?? {}) as Row);
    }
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
            <div className="text-sm font-semibold">Hero picture
              <PictureField value={cfg.heroImage ?? ""} onChange={(v) => setCfg({ ...cfg, heroImage: v })} />
            </div>
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
          <h2 className="text-xl font-bold">Contact details and service time</h2>
          <div className="mt-3 grid gap-3 bg-white p-5 shadow-sm md:grid-cols-2">
            {([["phone", "Phone number"], ["prayerPhone", "Prayer line"], ["email", "Email"], ["serviceTime", "Sunday service time (e.g. 08:30)"], ["address", "Address"]] as const).map(([k, l]) => (
              <label key={k} className={`text-sm font-semibold ${k === "address" ? "md:col-span-2" : ""}`}>{l}
                <input value={contact[k] ?? ""} onChange={(e) => setContact({ ...contact, [k]: e.target.value })} className="mt-1 w-full rounded border border-line px-3 py-2 font-normal" />
              </label>
            ))}
            {([["store", "Note at the top of the Store page"], ["give", "Note at the top of the Give page"], ["visit", "Note at the top of the Visit page"]] as const).map(([k, l]) => (
              <label key={k} className="text-sm font-semibold md:col-span-2">{l}
                <textarea value={notes[k] ?? ""} onChange={(e) => setNotes({ ...notes, [k]: e.target.value })} rows={2} className="mt-1 w-full rounded border border-line px-3 py-2 font-normal" />
              </label>
            ))}
            <button type="button" className="btn btn-ink md:col-span-2" onClick={async () => { if (await post({ action: "saveMisc", contact, notes })) alert("Saved. The site updates within a minute or two."); }}>Save</button>
          </div>
        </section>
        <ListEditor key={`m${Boolean((cfg.ministries as unknown[] | undefined)?.length)}${Object.keys(defs).length}`} title="Ministries" hint="Each one is a row on the Ministries page."
          custom={Boolean((cfg.ministries as unknown[] | undefined)?.length)}
          fields={[{ k: "name", label: "Name", type: "text" }, { k: "summary", label: "One-line summary", type: "text" }, { k: "body", label: "Details (blank line between paragraphs)", type: "area" }, { k: "gathering", label: "When it meets (optional)", type: "text" }, { k: "image", label: "Picture", type: "image" }]}
          initial={(((cfg.ministries as Record<string, unknown>[] | undefined)?.length ? cfg.ministries : defs.ministries) as Record<string, unknown>[] | undefined ?? []).map(toRow)}
          blank={{ name: "", summary: "", body: "", gathering: "", image: "" }}
          onSave={(items) => post({ action: "saveList", key: "ministries", items })} onReset={async () => { await post({ action: "resetList", key: "ministries" }); }} />
        <ListEditor key={`s${Boolean((cfg.story as unknown[] | undefined)?.length)}${Object.keys(defs).length}`} title="Our story (About page timeline)" hint="Entries appear in this order."
          custom={Boolean((cfg.story as unknown[] | undefined)?.length)}
          fields={[{ k: "year", label: "Year", type: "text" }, { k: "title", label: "Title", type: "text" }, { k: "body", label: "Text", type: "area" }]}
          initial={(((cfg.story as Record<string, unknown>[] | undefined)?.length ? cfg.story : defs.story) as Record<string, unknown>[] | undefined ?? []).map(toRow)}
          blank={{ year: "", title: "", body: "" }}
          onSave={(items) => post({ action: "saveList", key: "story", items })} onReset={async () => { await post({ action: "resetList", key: "story" }); }} />
        <ListEditor key={`b${Boolean((cfg.beliefs as unknown[] | undefined)?.length)}${Object.keys(defs).length}`} title="What we believe (About page cards)" hint="One card each."
          custom={Boolean((cfg.beliefs as unknown[] | undefined)?.length)}
          fields={[{ k: "t", label: "Heading", type: "text" }, { k: "d", label: "Text", type: "area" }]}
          initial={(((cfg.beliefs as Record<string, unknown>[] | undefined)?.length ? cfg.beliefs : defs.beliefs) as Record<string, unknown>[] | undefined ?? []).map(toRow)}
          blank={{ t: "", d: "" }}
          onSave={(items) => post({ action: "saveList", key: "beliefs", items })} onReset={async () => { await post({ action: "resetList", key: "beliefs" }); }} />
        <ListEditor key={`p${Boolean((cfg.pages as unknown[] | undefined)?.length)}${Object.keys(defs).length}`} title="Extra pages" hint="New pages open at /p/their-title. Add them to the menu below to link them."
          custom={Boolean((cfg.pages as unknown[] | undefined)?.length)}
          fields={[{ k: "title", label: "Page title", type: "text" }, { k: "intro", label: "Short introduction", type: "text" }, { k: "body", label: "Text (blank line between paragraphs)", type: "area" }]}
          initial={((cfg.pages as Record<string, unknown>[] | undefined) ?? []).map(toRow)}
          blank={{ title: "", intro: "", body: "" }}
          onSave={(items) => post({ action: "saveList", key: "pages", items })} onReset={async () => { await post({ action: "resetList", key: "pages" }); }} />
        <ListEditor key={`n${Boolean((cfg.menu as unknown[] | undefined)?.length)}${Object.keys(defs).length}`} title="Menu" hint="The links at the top of every page. Use addresses like /about, or /p/your-page."
          custom={Boolean((cfg.menu as unknown[] | undefined)?.length)}
          fields={[{ k: "label", label: "Name", type: "text" }, { k: "href", label: "Link", type: "text" }]}
          initial={(((cfg.menu as Record<string, unknown>[] | undefined)?.length ? cfg.menu : defs.menu) as Record<string, unknown>[] | undefined ?? []).map(toRow)}
          blank={{ label: "", href: "/" }}
          onSave={(items) => post({ action: "saveList", key: "menu", items })} onReset={async () => { await post({ action: "resetList", key: "menu" }); }} />
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
