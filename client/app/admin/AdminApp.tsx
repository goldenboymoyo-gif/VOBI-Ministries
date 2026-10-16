/* eslint-disable @typescript-eslint/no-explicit-any, @next/next/no-img-element */
"use client";

import { upload } from "@vercel/blob/client";
import { useCallback, useEffect, useId, useRef, useState } from "react";

type C = Record<string, any>;
type Session = { loggedIn: boolean; configured: boolean; storage?: string; blob?: boolean; offline?: boolean };

async function api(url: string, opts: RequestInit = {}) {
  const res = await fetch(url, { ...opts, headers: { ...(opts.body ? { "Content-Type": "application/json" } : {}), ...(opts.headers || {}) }, cache: "no-store" });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) { const e: any = new Error(json.error || `Request failed (${res.status}).`); e.status = res.status; throw e; }
  return json;
}

/* ---------- small building blocks ---------- */

function Field({ label, hint, value, onChange, textarea = false, rows = 4, type = "text", placeholder }: any) {
  const id = useId();
  return (
    <div className="adm-field">
      <label htmlFor={id}>{label}</label>
      {textarea ? <textarea id={id} rows={rows} value={value ?? ""} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
        : <input id={id} type={type} value={value ?? ""} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />}
      {hint ? <p className="adm-hint">{hint}</p> : null}
    </div>
  );
}
function Panel({ title, intro, children }: any) {
  return (
    <section className="adm-panel">
      <header className="adm-panel-head"><div><h2>{title}</h2>{intro ? <p>{intro}</p> : null}</div></header>
      {children}
    </section>
  );
}
function Card({ title, children, tools }: any) {
  return (
    <div className="adm-card">
      {title || tools ? <div className="adm-card-head"><h3>{title}</h3>{tools}</div> : null}
      <div className="adm-card-body">{children}</div>
    </div>
  );
}
function ListEditor({ items, onChange, renderItem, newItem, itemTitle, addLabel = "Add" }: any) {
  const move = (i: number, d: number) => { const n = [...items]; const [it] = n.splice(i, 1); n.splice(i + d, 0, it); onChange(n); };
  const remove = (i: number) => { if (window.confirm("Remove this item? Nothing changes on the website until you press Save.")) onChange(items.filter((_: any, j: number) => j !== i)); };
  return (
    <div className="adm-list">
      {items.map((it: any, i: number) => (
        <Card key={i} title={itemTitle ? itemTitle(it, i) : `#${i + 1}`} tools={
          <div className="adm-tools">
            <button type="button" className="adm-icon" disabled={i === 0} onClick={() => move(i, -1)} aria-label="Move up">↑</button>
            <button type="button" className="adm-icon" disabled={i === items.length - 1} onClick={() => move(i, 1)} aria-label="Move down">↓</button>
            <button type="button" className="adm-icon danger" onClick={() => remove(i)} aria-label="Remove">✕</button>
          </div>}>
          {renderItem(it, (v: any) => onChange(items.map((x: any, j: number) => (j === i ? v : x))), i)}
        </Card>
      ))}
      <button type="button" className="adm-btn adm-btn-add" onClick={() => onChange([...items, typeof newItem === "function" ? newItem() : newItem])}>+ {addLabel}</button>
    </div>
  );
}
function LinesEditor({ label, items, onChange, addLabel = "Add paragraph" }: any) {
  return (
    <div className="adm-field">
      <label>{label}</label>
      <div className="adm-lines">
        {items.map((line: string, i: number) => (
          <div className="adm-line" key={i}>
            <textarea rows={4} value={line} onChange={(e) => onChange(items.map((l: string, j: number) => (j === i ? e.target.value : l)))} />
            <button type="button" className="adm-icon danger" onClick={() => onChange(items.filter((_: any, j: number) => j !== i))} aria-label="Remove">✕</button>
          </div>
        ))}
        <button type="button" className="adm-btn adm-btn-small" onClick={() => onChange([...items, ""])}>+ {addLabel}</button>
      </div>
    </div>
  );
}

async function resizeToJpeg(file: File | Blob, max = 1920) {
  const bmp = await createImageBitmap(file);
  const sc = Math.min(1, max / Math.max(bmp.width, bmp.height));
  const c = document.createElement("canvas"); c.width = Math.round(bmp.width * sc); c.height = Math.round(bmp.height * sc);
  const ctx = c.getContext("2d")!; ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, c.width, c.height); ctx.drawImage(bmp, 0, 0, c.width, c.height);
  let q = 0.85, d = c.toDataURL("image/jpeg", q);
  while (d.length > 4.2e6 && q > 0.4) { q -= 0.1; d = c.toDataURL("image/jpeg", q); }
  return d;
}
async function sendPicture(dataUrl: string) {
  const j = await api("/api/admin/upload", { method: "POST", body: JSON.stringify({ data: dataUrl }) });
  return j.url as string;
}
async function posterOf(file: File): Promise<string | null> {
  const url = URL.createObjectURL(file);
  const v = document.createElement("video"); v.muted = true; v.playsInline = true; v.preload = "auto"; v.src = url;
  await new Promise((r) => { v.onloadeddata = () => r(null); v.onerror = () => r(null); setTimeout(() => r(null), 8000); });
  if (!v.videoWidth) return null;
  v.currentTime = Math.min(1.5, (v.duration || 3) / 2);
  await new Promise((r) => { v.onseeked = () => r(null); setTimeout(() => r(null), 4000); });
  const c = document.createElement("canvas"); const sc = Math.min(1, 960 / v.videoWidth);
  c.width = Math.round(v.videoWidth * sc); c.height = Math.round(v.videoHeight * sc);
  c.getContext("2d")!.drawImage(v, 0, 0, c.width, c.height);
  URL.revokeObjectURL(url);
  return sendPicture(c.toDataURL("image/jpeg", 0.8));
}

function ImageField({ label = "Photo", value, onChange, notify }: any) {
  const [busy, setBusy] = useState(false);
  const input = useRef<HTMLInputElement>(null);
  return (
    <div className="adm-field">
      <label>{label}</label>
      <div className="adm-image">
        <div className="adm-image-thumb">{value ? <img src={value} alt="" /> : <span>No photo</span>}</div>
        <div className="adm-image-actions">
          <button type="button" className="adm-btn adm-btn-small" disabled={busy} onClick={() => input.current?.click()}>{busy ? "Uploading…" : "Upload new photo"}</button>
          {value ? <button type="button" className="adm-btn adm-btn-small adm-btn-ghost" onClick={() => onChange("")}>Remove photo</button> : null}
          <input ref={input} type="file" accept="image/*" hidden onChange={async (e) => {
            const f = e.target.files?.[0]; e.target.value = ""; if (!f) return;
            setBusy(true);
            try { onChange(await sendPicture(await resizeToJpeg(f))); } catch (err: any) { notify(err.message || "Upload failed", "error"); }
            setBusy(false);
          }} />
        </div>
      </div>
    </div>
  );
}

function VideoUploadField({ label, value, onChange, notify, blob }: any) {
  const [pct, setPct] = useState<number | null>(null);
  const input = useRef<HTMLInputElement>(null);
  return (
    <div className="adm-field">
      <label>{label}</label>
      <div className="adm-image">
        <div className="adm-image-thumb">{value ? <video src={value} muted playsInline /> : <span>No video</span>}</div>
        <div className="adm-image-actions">
          <button type="button" className="adm-btn adm-btn-small" disabled={pct !== null} onClick={() => (blob ? input.current?.click() : notify("Video storage is not switched on yet. See the Overview page.", "error"))}>
            {pct !== null ? `Uploading ${pct}%` : "Upload a video file"}
          </button>
          {value ? <button type="button" className="adm-btn adm-btn-small adm-btn-ghost" onClick={() => onChange("")}>Remove video</button> : null}
          <input ref={input} type="file" accept="video/mp4,video/webm,video/quicktime" hidden onChange={async (e) => {
            const f = e.target.files?.[0]; e.target.value = ""; if (!f) return;
            setPct(0);
            try {
              const r = await upload(f.name, f, { access: "public", handleUploadUrl: "/api/admin/blob", onUploadProgress: (p) => setPct(Math.round(p.percentage)) });
              onChange(r.url);
            } catch (err: any) { notify(err.message || "Upload failed", "error"); }
            setPct(null);
          }} />
        </div>
      </div>
    </div>
  );
}

/* ---------- login ---------- */

function Login({ session, onDone }: { session: Session; onDone: () => void }) {
  const [password, setPassword] = useState(""); const [error, setError] = useState(""); const [busy, setBusy] = useState(false);
  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setBusy(true); setError("");
    try { await api("/api/admin/login", { method: "POST", body: JSON.stringify({ password }) }); onDone(); } catch (err: any) { setError(err.message); }
    setBusy(false);
  };
  return (
    <div className="adm-login">
      <form className="adm-login-box" onSubmit={submit}>
        <img src="/brand/logo-mark.png" alt="VOBI Ministries" width="96" />
        <h1>Website admin</h1>
        {session.offline ? <div className="adm-note error">The website can&apos;t be reached right now. Reload this page in a minute.</div>
          : !session.configured ? <div className="adm-note error">The admin password has not been set up yet. Add <code>ADMIN_PASSWORD</code> in Vercel → Settings → Environment Variables, then redeploy.</div>
          : (<>
            <label htmlFor="adm-pass">Password</label>
            <input id="adm-pass" type="password" autoComplete="new-password" data-lpignore="true" data-1p-ignore="true" data-form-type="other" value={password} onChange={(e) => setPassword(e.target.value)} autoFocus required />
            {error ? <p className="adm-error">{error}</p> : null}
            <button className="adm-btn adm-btn-block" disabled={busy || !password}>{busy ? "Checking…" : "Log in"}</button>
          </>)}
        <a className="adm-back" href="/">← Back to the website</a>
      </form>
    </div>
  );
}

/* ---------- the sections ---------- */

const CATS: [string, string][] = [["sermons", "Sermons"], ["testimony", "Testimony"], ["prophecy", "Prophecy"], ["massprayer", "Mass Prayer"], ["praise", "Praise & Worship"], ["funny", "Funny Moments"]];
const ytIdOf = (s: string) => { const t = s.trim(); return /^[\w-]{11}$/.test(t) ? t : t.match(/(?:v=|youtu\.be\/|embed\/|shorts\/|live\/)([\w-]{11})/)?.[1] ?? ""; };

function HomeEditor({ c, set, notify, blob }: any) {
  return (
    <Panel title="Home page" intro="The big picture or video at the top of the home page, and the gold announcement bar under it.">
      <Card title="Hero">
        <ImageField label="Hero picture (shown while the video loads, or when there is no video)" value={c.heroImage} notify={notify} onChange={(v: string) => set((n: C) => { n.heroImage = v; })} />
        <VideoUploadField label="Hero video file (optional, plays instead of the YouTube video)" value={c.heroVideoFile} blob={blob} notify={notify} onChange={(v: string) => set((n: C) => { n.heroVideoFile = v; })} />
        <Field label="Hero video from YouTube (optional)" hint="This is the video playing on the site now. Paste another YouTube link to change it." value={c.heroVideo} onChange={(v: string) => set((n: C) => { n.heroVideo = v; })} />
        {ytIdOf(c.heroVideo) ? <div className="adm-field"><label>Current hero video</label><img className="adm-yt" src={`https://img.youtube.com/vi/${ytIdOf(c.heroVideo)}/mqdefault.jpg`} alt="" /></div> : null}
      </Card>
      <Card title="Announcement bar">
        <Field label="Message" hint="Leave empty to hide the bar." value={c.announcement} onChange={(v: string) => set((n: C) => { n.announcement = v; })} />
      </Card>
    </Panel>
  );
}

function DetailsEditor({ id, c, set }: any) {
  const d = (c.details || {})[id] || {};
  const up = (k: string, v: string) => set((n: C) => { n.details = n.details || {}; n.details[id] = { ...(n.details[id] || {}), [k]: v }; });
  return (
    <div className="adm-details">
      <Field label="Date" type="date" value={d.date || ""} onChange={(v: string) => up("date", v)} />
      <Field label="Name of the person (testimony or prophecy)" value={d.person || ""} onChange={(v: string) => up("person", v)} />
      <Field label="Place" value={d.place || ""} onChange={(v: string) => up("place", v)} />
      <Field label="Description" textarea rows={3} value={d.description || ""} onChange={(v: string) => up("description", v)} />
    </div>
  );
}

function VideosEditor({ c, set, notify, blob }: any) {
  const [nv, setNv] = useState<C>({ url: "", title: "", cat: "sermons", src: "", poster: "", date: "", person: "", place: "", description: "" });
  const [find, setFind] = useState("");
  const [open, setOpen] = useState("");
  const [busy, setBusy] = useState(false);
  const [allTv, setAllTv] = useState(false);
  const add = () => {
    const id = ytIdOf(nv.url);
    if (!nv.title.trim()) return notify("Give the video a title.", "error");
    if (!id && !nv.src) return notify("Paste a YouTube link, or upload a video file.", "error");
    const vid = nv.src ? `v${Date.now().toString(36)}` : id;
    set((n: C) => {
      n.videos = [nv.src ? { id: vid, title: nv.title, cat: nv.cat, src: nv.src, poster: nv.poster } : { id, title: nv.title, cat: nv.cat }, ...(n.videos || [])];
      n.details = n.details || {}; n.details[vid] = { date: nv.date, person: nv.person, place: nv.place, description: nv.description };
    });
    setNv({ url: "", title: "", cat: nv.cat, src: "", poster: "", date: "", person: "", place: "", description: "" });
  };
  return (
    <Panel title="Videos on VOBI TV" intro="Add a video from YouTube, or upload a video file from your computer. It appears on the VOBI TV page in the category you choose.">
      <Card title="Add a video">
        <Field label="Title" value={nv.title} onChange={(v: string) => setNv({ ...nv, title: v })} />
        <div className="adm-field"><label>Category</label>
          <select value={nv.cat} onChange={(e) => setNv({ ...nv, cat: e.target.value })}>{CATS.map(([k, l]) => <option key={k} value={k}>{l}</option>)}</select>
        </div>
        <Field label="Date" type="date" hint="When it was recorded." value={nv.date} onChange={(v: string) => setNv({ ...nv, date: v })} />
        <Field label="Name of the person" hint="For testimonies and prophecy: who is giving it." value={nv.person} onChange={(v: string) => setNv({ ...nv, person: v })} />
        <Field label="Place" value={nv.place} onChange={(v: string) => setNv({ ...nv, place: v })} />
        <Field label="Description" textarea rows={3} value={nv.description} onChange={(v: string) => setNv({ ...nv, description: v })} />
        <Field label="YouTube link" hint="Use this, or upload a file below." value={nv.url} onChange={(v: string) => setNv({ ...nv, url: v })} />
        <VideoUploadField label="Or upload a video file" value={nv.src} blob={blob} notify={notify}
          onChange={async (v: string) => { setNv((o: C) => ({ ...o, src: v })); }} />
        {nv.src && !nv.poster ? (
          <div className="adm-field"><button type="button" className="adm-btn adm-btn-small adm-btn-ghost" disabled={busy} onClick={async () => {
            setBusy(true);
            try {
              const blobRes = await fetch(nv.src); const f = new File([await blobRes.blob()], "v.mp4", { type: "video/mp4" });
              const p = await posterOf(f); if (p) setNv((o: C) => ({ ...o, poster: p })); else notify("Could not make a cover picture. Upload one below.", "error");
            } catch { notify("Could not make a cover picture. Upload one below.", "error"); }
            setBusy(false);
          }}>{busy ? "Working…" : "Make a cover picture from the video"}</button></div>
        ) : null}
        {nv.src ? <ImageField label="Cover picture" value={nv.poster} notify={notify} onChange={(v: string) => setNv({ ...nv, poster: v })} /> : null}
        <button type="button" className="adm-btn" onClick={add}>Add video</button>
      </Card>
      <h3 className="adm-sub">Videos you added</h3>
      <ListEditor items={c.videos || []} onChange={(v: any) => set((n: C) => { n.videos = v; })} itemTitle={(v: C) => v.title || "Video"} addLabel="" renderItem={(v: C, up: any) => (
        <>
          <Field label="Title" value={v.title} onChange={(t: string) => up({ ...v, title: t })} />
          <div className="adm-field"><label>Category</label>
            <select value={v.cat} onChange={(e) => up({ ...v, cat: e.target.value })}>{CATS.map(([k, l]) => <option key={k} value={k}>{l}</option>)}</select>
          </div>
          <p className="adm-hint">{v.src ? "Uploaded video file" : `YouTube video ${v.id}`}</p>
          <DetailsEditor id={v.id} c={c} set={set} />
        </>
      )} newItem={{ id: "", title: "", cat: "sermons" }} />
      <h3 className="adm-sub">Videos already on the site ({(c.tv || []).length - (c.hiddenVideos || []).length} showing)</h3>
      <p className="adm-hint">Press Hide to take a video off VOBI TV, or Show to bring it back. Then press Publish.</p>
      <input className="adm-search" placeholder="Search videos by title…" value={find} onChange={(e) => setFind(e.target.value)} />
      <div className="adm-tv">
        {(c.tv || []).filter((v: C) => !(c.removedVideos || []).includes(v.id)).filter((v: C) => !find || `${v.title} ${(c.details || {})[v.id]?.person || ""}`.toLowerCase().includes(find.toLowerCase())).slice(0, allTv || find ? 5000 : 60).map((v: C) => {
          const off = (c.hiddenVideos || []).includes(v.id);
          return (
            <div key={v.id} className={`adm-tv-item ${off ? "off" : ""}`}>
              <img src={`https://img.youtube.com/vi/${v.id}/mqdefault.jpg`} alt="" loading="lazy" />
              <div><b>{v.title}</b><span>{CATS.find(([k]) => k === v.cat)?.[1] || v.cat}</span></div>
              <div className="adm-tv-btns">
                <button type="button" className="adm-btn adm-btn-small adm-btn-ghost" onClick={() => setOpen(open === v.id ? "" : v.id)}>Details</button>
                <button type="button" className="adm-btn adm-btn-small adm-btn-ghost" onClick={() => set((n: C) => { const h = new Set(n.hiddenVideos || []); if (h.has(v.id)) h.delete(v.id); else h.add(v.id); n.hiddenVideos = [...h]; })}>{off ? "Show" : "Hide"}</button>
                <button type="button" className="adm-btn adm-btn-small adm-btn-ghost" onClick={() => { if (window.confirm("Remove this video from the website for good? Then press Save.")) set((n: C) => { n.hiddenVideos = [...new Set([...(n.hiddenVideos || []), v.id])]; n.removedVideos = [...new Set([...(n.removedVideos || []), v.id])]; }); }}>Remove</button>
              </div>
              {open === v.id ? <div className="adm-tv-details"><DetailsEditor id={v.id} c={c} set={set} /></div> : null}
            </div>
          );
        })}
      </div>
      {!allTv && (c.tv || []).length > 60 ? <button type="button" className="adm-btn adm-btn-ghost" onClick={() => setAllTv(true)}>Show all {(c.tv || []).length} videos</button> : null}
    </Panel>
  );
}

function EventsEditor({ c, set, notify }: any) {
  return (
    <Panel title="Events" intro="Add the events you want on the website. Remove one with the X, then press Save.">
      <ListEditor items={c.events} onChange={(v: any) => set((n: C) => { n.events = v; })} itemTitle={(e: C) => e.title || "New event"} addLabel="Add event"
        newItem={() => ({ id: "", title: "", date: "", time: "", location: "", description: "", image: "" })}
        renderItem={(e: C, up: any) => (
          <>
            <Field label="Event name" value={e.title} onChange={(v: string) => up({ ...e, title: v })} />
            <Field label="Date" type="date" value={e.date} onChange={(v: string) => up({ ...e, date: v })} />
            <Field label="Time" placeholder="08:30" value={e.time} onChange={(v: string) => up({ ...e, time: v })} />
            <Field label="Place" value={e.location} onChange={(v: string) => up({ ...e, location: v })} />
            <Field label="Description" textarea rows={4} value={e.description} onChange={(v: string) => up({ ...e, description: v })} />
            <ImageField label="Event picture (optional)" value={e.image} onChange={(v: string) => up({ ...e, image: v })} notify={notify} />
          </>
        )} />
    </Panel>
  );
}

function AboutEditor({ c, set }: any) {
  return (
    <Panel title="About page" intro="The text on the About page.">
      <Card title="Who we are">
        <Field label="Text" hint="Separate paragraphs with a blank line. Leave empty to keep the original text." textarea rows={7} value={c.aboutWho} onChange={(v: string) => set((n: C) => { n.aboutWho = v; })} />
      </Card>
      <h3 className="adm-sub">Our story</h3>
      <ListEditor items={c.story} onChange={(v: any) => set((n: C) => { n.story = v; })} itemTitle={(e: C) => `${e.year} ${e.title}`} addLabel="Add an entry" newItem={{ year: "", title: "", body: "" }}
        renderItem={(e: C, up: any) => (<>
          <Field label="Year" value={e.year} onChange={(v: string) => up({ ...e, year: v })} />
          <Field label="Title" value={e.title} onChange={(v: string) => up({ ...e, title: v })} />
          <Field label="Text" textarea rows={4} value={e.body} onChange={(v: string) => up({ ...e, body: v })} />
        </>)} />
      <h3 className="adm-sub">What we believe</h3>
      <ListEditor items={c.beliefs} onChange={(v: any) => set((n: C) => { n.beliefs = v; })} itemTitle={(e: C) => e.t} addLabel="Add a card" newItem={{ t: "", d: "" }}
        renderItem={(e: C, up: any) => (<>
          <Field label="Heading" value={e.t} onChange={(v: string) => up({ ...e, t: v })} />
          <Field label="Text" textarea rows={3} value={e.d} onChange={(v: string) => up({ ...e, d: v })} />
        </>)} />
    </Panel>
  );
}

function MinistriesEditor({ c, set, notify }: any) {
  return (
    <Panel title="Ministries" intro="Each ministry is one row on the Ministries page.">
      <ListEditor items={c.ministries} onChange={(v: any) => set((n: C) => { n.ministries = v; })} itemTitle={(m: C) => m.name || "New ministry"} addLabel="Add a ministry"
        newItem={{ name: "", summary: "", body: [""], gathering: "", image: "" }}
        renderItem={(m: C, up: any) => (<>
          <Field label="Name" value={m.name} onChange={(v: string) => up({ ...m, name: v })} />
          <Field label="One-line summary" value={m.summary} onChange={(v: string) => up({ ...m, summary: v })} />
          <LinesEditor label="Details" items={m.body || []} onChange={(v: string[]) => up({ ...m, body: v })} />
          <Field label="When it meets (optional)" value={m.gathering} onChange={(v: string) => up({ ...m, gathering: v })} />
          <ImageField label="Picture" value={m.image} notify={notify} onChange={(v: string) => up({ ...m, image: v })} />
        </>)} />
    </Panel>
  );
}

function ContactEditor({ c, set }: any) {
  const f = (k: string, label: string, extra: any = {}) => <Field key={k} label={label} value={c.contact?.[k]} onChange={(v: string) => set((n: C) => { n.contact = { ...(n.contact || {}), [k]: v }; })} {...extra} />;
  const note = (k: string, label: string) => <Field key={k} label={label} textarea rows={3} hint="Shown as a gold bar at the top of the page. Leave empty to hide." value={c.notes?.[k]} onChange={(v: string) => set((n: C) => { n.notes = { ...(n.notes || {}), [k]: v }; })} />;
  return (
    <Panel title="Contact details" intro="Used in the footer and on the Contact, Give, Store and Visit pages.">
      <Card title="Contact">{f("phone", "Phone number")}{f("prayerPhone", "Prayer line")}{f("email", "Email")}{f("serviceTime", "Sunday service time", { placeholder: "08:30" })}{f("address", "Address")}</Card>
      <Card title="Notes on pages">{note("store", "Store page")}{note("give", "Give page")}{note("visit", "Visit page")}</Card>
    </Panel>
  );
}

function MenuEditor({ c, set }: any) {
  return (
    <Panel title="Menu and extra pages" intro="Change the links at the top of every page, and write new pages. A new page opens at /p/its-title, for example /p/our-vision. Add it to the menu to link it.">
      <h3 className="adm-sub">Menu</h3>
      <ListEditor items={c.menu} onChange={(v: any) => set((n: C) => { n.menu = v; })} itemTitle={(m: C) => m.label} addLabel="Add a menu link" newItem={{ label: "", href: "/" }}
        renderItem={(m: C, up: any) => (<>
          <Field label="Name" value={m.label} onChange={(v: string) => up({ ...m, label: v })} />
          <Field label="Link" hint="For example /about or /p/our-vision" value={m.href} onChange={(v: string) => up({ ...m, href: v })} />
        </>)} />
      <h3 className="adm-sub">Extra pages</h3>
      <ListEditor items={c.pages} onChange={(v: any) => set((n: C) => { n.pages = v; })} itemTitle={(p: C) => p.title || "New page"} addLabel="Add a page" newItem={{ title: "", intro: "", body: [""] }}
        renderItem={(p: C, up: any) => (<>
          <Field label="Page title" value={p.title} onChange={(v: string) => up({ ...p, title: v })} />
          <Field label="Short introduction" value={p.intro} onChange={(v: string) => up({ ...p, intro: v })} />
          <LinesEditor label="Text" items={p.body || []} onChange={(v: string[]) => up({ ...p, body: v })} />
        </>)} />
    </Panel>
  );
}

function VisitorsPanel({ notify }: any) {
  const [d, setD] = useState<any>(null);
  useEffect(() => { api("/api/admin/data").then(setD).catch((e: any) => notify(e.message, "error")); }, [notify]);
  if (!d) return <div className="adm-loading">Loading…</div>;
  const v: Record<string, any> = d.visits || {};
  const days = Object.keys(v).sort();
  const sum = (n: number) => days.slice(-n).reduce((t, k) => t + (v[k].visitors || 0), 0);
  const today = new Date(Date.now() + 2 * 3600000).toISOString().slice(0, 10);
  const all = days.reduce((t, k) => t + v[k].visitors, 0);
  const mob = days.reduce((t, k) => t + v[k].mobile, 0);
  const top = (key: string) => { const m: Record<string, number> = {}; days.forEach((k) => Object.entries(v[k][key] || {}).forEach(([p, n]) => { m[p] = (m[p] || 0) + (n as number); })); return Object.entries(m).sort((a, b) => b[1] - a[1]).slice(0, 8); };
  const max = Math.max(1, ...days.slice(-14).map((k) => v[k].visitors));
  return (
    <Panel title="Visitors" intro="Anonymous visit counts. No names, cookies or IP addresses are stored. Each person is counted once a day.">
      <Card title="Summary">
        <p>Today: <b>{v[today]?.visitors || 0}</b> · Last 7 days: <b>{sum(7)}</b> · Last 30 days: <b>{sum(30)}</b> · Members signed up: <b>{(d.users || []).length}</b></p>
        <p className="adm-hint">On phones: {all ? Math.round((mob / all) * 100) : 0}% of visitors.</p>
      </Card>
      <Card title="Last 14 days">
        {!days.length ? <p className="adm-hint">No visits recorded yet. Counting starts after this update goes live.</p> : days.slice(-14).reverse().map((k) => (
          <div key={k} style={{ display: "flex", alignItems: "center", gap: 10, margin: "4px 0" }}>
            <span style={{ width: 90 }} className="adm-hint">{k}</span>
            <span style={{ height: 10, borderRadius: 5, background: "#d9c27a", width: Math.max(4, (v[k].visitors / max) * 60) + "%" }} />
            <b>{v[k].visitors}</b>
          </div>
        ))}
      </Card>
      <Card title="Where visitors start">{top("entry").map(([p, n]) => <p key={p}>{p}: {n}</p>)}</Card>
      <Card title="Where visitors come from">{top("from").map(([p, n]) => <p key={p}>{p}: {n}</p>)}</Card>
    </Panel>
  );
}

function ModerationEditor({ notify }: any) {
  const [d, setD] = useState<any>(null);
  const [open, setOpen] = useState<string | null>(null);
  const load = useCallback(async () => { try { setD(await api("/api/admin/data")); } catch (e: any) { notify(e.message, "error"); } }, [notify]);
  useEffect(() => { void load(); }, [load]);
  const del = async (body: object) => { if (!confirm("Delete this?")) return; await api("/api/admin/data", { method: "DELETE", body: JSON.stringify(body) }); void load(); };
  const patch = async (body: object) => { await api("/api/admin/data", { method: "PATCH", body: JSON.stringify(body) }); void load(); };
  if (!d) return <div className="adm-loading">Loading…</div>;
  const vids = Object.keys(d.comments).filter((v) => d.comments[v].length);
  const users: any[] = d.users || [];
  const byId = (id?: string) => users.find((u) => u.id === id);
  const openReports = (d.reports || []).filter((r: any) => r.open).slice().reverse();
  const when = (t: number) => new Date(t).toLocaleString();
  const Profile = ({ u }: { u: any }) => (
    <div className="adm-hint" style={{ padding: "8px 0 10px 12px", borderLeft: "3px solid #d9c27a", margin: "6px 0" }}>
      <p><b>{u.name}</b>{u.banned ? " (suspended)" : ""}</p>
      <p>Email: <a href={"mailto:" + u.email}>{u.email}</a></p>
      {u.phone ? <p>Phone: <a href={"tel:" + u.phone}>{u.phone}</a></p> : null}
      <p>Joined: {when(u.createdAt)} · Cookies: {u.cookies ? u.cookies + (u.prefs ? " (preferences " + (u.prefs.preferences ? "on" : "off") + ", videos " + (u.prefs.media ? "on" : "off") + ")" : "") : "not chosen"}</p>
      <p>Messages in chat: {d.chat.filter((m: any) => m.uid === u.id).length}</p>
      <p><button type="button" className="adm-btn adm-btn-small adm-btn-ghost" onClick={() => patch({ kind: "ban", id: u.id, banned: !u.banned })}>{u.banned ? "Restore chat access" : "Suspend from chat"}</button></p>
    </div>
  );
  return (
    <Panel title="Comments and live chat" intro="Deleting here takes effect straight away. You do not need to press Save.">
      <Card title={"Prayer requests and messages (" + (d.inquiries || []).length + ")"}>
        {!(d.inquiries || []).length ? <p className="adm-hint">Nothing yet. Every prayer request and message sent from the website is saved here and also emailed.</p> : (d.inquiries || []).slice().reverse().map((q: any) => (
          <div className="adm-line" key={q.id}><p style={{ flex: 1 }}><b>{q.kind === "prayer" ? "Prayer request" : "Message"}</b> from {q.name || "Anonymous"}{q.contact ? " (" + q.contact + ")" : ""}{q.subject ? " · " + q.subject : ""}<br />{q.message}<br /><span className="adm-hint">{when(q.at)}</span></p>
            <button type="button" className="adm-btn adm-btn-small adm-btn-ghost" onClick={() => del({ kind: "inquiry", id: q.id })}>Delete</button></div>
        ))}
      </Card>
      <Card title={"Policy reports (" + openReports.length + " open)"}>
        {!openReports.length ? <p className="adm-hint">No open reports. Messages with links or offensive words are flagged here automatically, and viewers can report a message.</p> : openReports.map((r: any) => {
          const u = byId(r.uid);
          return (
            <div key={r.id}>
              <div className="adm-line"><p style={{ flex: 1 }}><b>{r.name}</b>: {r.text}<br /><span className="adm-hint">{r.reason} · by {r.by} · {when(r.at)}{u ? " · " + u.email : ""}</span></p>
                <button type="button" className="adm-btn adm-btn-small adm-btn-ghost" onClick={() => patch({ kind: "resolve", id: r.id })}>Resolve</button>
                <button type="button" className="adm-btn adm-btn-small adm-btn-ghost" onClick={() => del({ kind: "chat", id: r.msgId })}>Delete message</button>
                {u ? <button type="button" className="adm-btn adm-btn-small adm-btn-ghost" onClick={() => setOpen(open === "r" + r.id ? null : "r" + r.id)}>Profile</button> : null}
              </div>
              {u && open === "r" + r.id ? <Profile u={u} /> : null}
            </div>
          );
        })}
      </Card>
      <Card title={"Members (" + users.length + ")"}>
        {!users.length ? <p className="adm-hint">Nobody has signed up yet.</p> : users.slice().reverse().map((u) => (
          <div key={u.id}>
            <div className="adm-line"><p style={{ flex: 1 }}><b>{u.name}</b> · {u.email}{u.banned ? " · suspended" : ""}</p>
              <button type="button" className="adm-btn adm-btn-small adm-btn-ghost" onClick={() => setOpen(open === "u" + u.id ? null : "u" + u.id)}>Profile</button></div>
            {open === "u" + u.id ? <Profile u={u} /> : null}
          </div>
        ))}
      </Card>
      <Card title="Likes">{Object.keys(d.likes).length ? Object.entries(d.likes).map(([v, n]) => <p key={v}>Video {v}: {n as number}</p>) : <p className="adm-hint">No likes yet.</p>}</Card>
      <Card title="Comments">
        {!vids.length ? <p className="adm-hint">No comments yet.</p> : vids.map((v) => (
          <div key={v}><p className="adm-hint"><b>Video {v}</b></p>
            {d.comments[v].slice().reverse().map((x: any) => (
              <div className="adm-line" key={x.id}><p style={{ flex: 1 }}><b>{x.name}</b>: {x.text}</p><button type="button" className="adm-btn adm-btn-small adm-btn-ghost" onClick={() => del({ kind: "comment", video: v, id: x.id })}>Delete</button></div>
            ))}</div>
        ))}
      </Card>
      <Card title="Live chat" tools={<button type="button" className="adm-btn adm-btn-small adm-btn-ghost" onClick={() => del({ kind: "chat-all" })}>Clear all</button>}>
        {!d.chat.length ? <p className="adm-hint">No messages yet.</p> : d.chat.slice().reverse().map((m: any) => {
          const u = byId(m.uid);
          return (
            <div key={m.id}>
              <div className="adm-line"><p style={{ flex: 1 }}>{u ? <button type="button" style={{ font: "inherit", fontWeight: 700, background: "none", border: 0, padding: 0, textDecoration: "underline", cursor: "pointer" }} onClick={() => setOpen(open === "c" + m.id ? null : "c" + m.id)}>{m.name}</button> : <b>{m.name}</b>}: {m.text}</p><button type="button" className="adm-btn adm-btn-small adm-btn-ghost" onClick={() => del({ kind: "chat", id: m.id })}>Delete</button></div>
              {u && open === "c" + m.id ? <Profile u={u} /> : null}
            </div>
          );
        })}
      </Card>
    </Panel>
  );
}

function Overview({ session, c, go }: any) {
  const stats: [string, string, string][] = [
    ["Videos added here", String((c.videos || []).length), "videos"], ["Events", String(c.events.length), "events"],
    ["Ministries", String(c.ministries.length), "ministries"], ["Extra pages", String((c.pages || []).length), "menu"],
  ];
  return (
    <Panel title="Welcome back" intro="Choose what you would like to change. Nothing changes on the website until you press Save.">
      {session.storage === "none" ? <div className="adm-note error"><strong>View-only mode.</strong> Saving is not switched on. In Vercel → Settings → Environment Variables add <code>GITHUB_TOKEN</code> and <code>DATA_REPO</code>, then redeploy.</div> : null}
      {!session.blob ? <div className="adm-note">Uploading video files needs video storage. In Vercel open <strong>Storage → Create → Blob</strong>, connect it to this project and redeploy. YouTube links work without it.</div> : null}
      <div className="adm-stats">
        {stats.map(([l, v, t]) => (<button type="button" className="adm-stat" key={l} onClick={() => go(t)}><span className="adm-stat-value">{v}</span><span className="adm-stat-label">{l}</span></button>))}
      </div>
      <div className="adm-card"><div className="adm-card-body adm-howto">
        <h3>How publishing works</h3>
        <ol><li>Make your changes in any section.</li><li>Press <strong>Save changes</strong> at the bottom of the screen.</li><li>The website updates itself, usually within a minute or two.</li></ol>
      </div></div>
    </Panel>
  );
}

/* ---------- the app ---------- */

const TABS: [string, string][] = [
  ["overview", "Dashboard"], ["home", "Homepage"], ["videos", "VOBI TV videos"], ["events", "Events & Gatherings"], ["about", "About page"],
  ["ministries", "Ministries"], ["contact", "Contact details"], ["menu", "Menu & pages"], ["visitors", "Visitors"], ["moderation", "Comments & chat"],
];
const ICONS: Record<string, string> = { overview: "▦", home: "⌂", videos: "▶", events: "▤", about: "✎", ministries: "♥", contact: "☎", menu: "☰", moderation: "✉", visitors: "◔" };

function MediaLibrary({ notify }: { notify: (t: string, k?: string) => void }) {
  const [files, setFiles] = useState<{ name: string; url: string; size: number }[]>([]);
  const [q, setQ] = useState("");
  const [busy, setBusy] = useState(false);
  const input = useRef<HTMLInputElement>(null);
  const reload = useCallback(async () => { try { setFiles((await api("/api/admin/media")).files || []); } catch {} }, []);
  useEffect(() => { void reload(); }, [reload]);
  const shown = files.filter((f) => f.name.toLowerCase().includes(q.toLowerCase()));
  return (
    <section className="adm-side-card">
      <div className="adm-side-head"><h3>Media Library</h3>
        <button type="button" className="adm-btn adm-btn-small" disabled={busy} onClick={() => input.current?.click()}>{busy ? "Uploading…" : "⇪ Upload Media"}</button>
      </div>
      <input ref={input} type="file" accept="image/*" hidden onChange={async (e) => {
        const f = e.target.files?.[0]; e.target.value = ""; if (!f) return; setBusy(true);
        try { await sendPicture(await resizeToJpeg(f)); notify("Picture uploaded."); await reload(); } catch (err: any) { notify(err.message || "Upload failed", "error"); }
        setBusy(false);
      }} />
      <input className="adm-search" placeholder="Search files…" value={q} onChange={(e) => setQ(e.target.value)} />
      <div className="adm-media">
        {shown.map((f) => (
          <button type="button" key={f.name} title="Click to copy the picture link" onClick={() => { void navigator.clipboard?.writeText(f.url); notify("Picture link copied. Paste it into any picture box."); }}>
            <img src={f.url} alt="" loading="lazy" /><span>{f.name.slice(0, 12)} · {(f.size / 1048576).toFixed(1)} MB</span>
          </button>
        ))}
        {!shown.length ? <p className="adm-hint">No uploaded pictures yet.</p> : null}
      </div>
    </section>
  );
}

export default function AdminApp() {
  const [session, setSession] = useState<Session | null>(null);
  const [tab, setTab] = useState("overview");
  const [content, setContent] = useState<C | null>(null);
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ text: string; type: string; id: number } | null>(null);
  const [loadError, setLoadError] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  const notify = useCallback((text: string, type = "ok") => setToast({ text, type, id: Date.now() }), []);
  useEffect(() => { if (!toast) return; const t = setTimeout(() => setToast(null), toast.type === "error" ? 8000 : 5000); return () => clearTimeout(t); }, [toast]);

  const loadSession = useCallback(async () => { try { setSession(await api("/api/admin/login")); } catch { setSession({ loggedIn: false, configured: true, offline: true }); } }, []);
  const loadContent = useCallback(async () => {
    setLoadError("");
    try {
      const { settings: s, events, defaults: d } = await api("/api/admin/settings");
      const pick = (k: string) => (s.emptied?.includes(k) ? [] : s[k]?.length ? s[k] : d[k]);
      const toBody = (m: C) => ({ ...m, body: Array.isArray(m.body) ? m.body : [m.body || ""] });
      setContent({
        heroVideo: s.heroVideo || d.hero.video, heroImage: s.heroImage || d.hero.image, hiddenVideos: s.hiddenVideos || [], removedVideos: s.removedVideos || [], details: s.details || {}, tv: d.tv, heroDefault: d.hero, heroVideoFile: s.heroVideoFile || "", announcement: s.announcement || "", aboutWho: s.aboutWho || "",
        videos: s.videos || [], events: events || [], ministries: pick("ministries").map(toBody), story: pick("story"), beliefs: pick("beliefs"), menu: pick("menu"),
        pages: (s.pages || []).map(toBody), contact: { ...d.contact, ...Object.fromEntries(Object.entries(s.contact || {}).filter(([, v]) => v)) }, notes: s.notes || {},
      });
      setDirty(false);
    } catch (err: any) { if (err.status === 401) setSession((x) => ({ ...(x as Session), loggedIn: false })); setLoadError(err.message); }
  }, []);

  useEffect(() => { void loadSession(); }, [loadSession]);
  useEffect(() => {
    const out = () => { try { navigator.sendBeacon("/api/admin/login?logout=1"); } catch {} };
    window.addEventListener("pagehide", out);
    return () => { window.removeEventListener("pagehide", out); out(); };
  }, []);
  useEffect(() => { if (session?.loggedIn) void loadContent(); }, [session?.loggedIn, loadContent]);
  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => { e.preventDefault(); e.returnValue = ""; };
    window.addEventListener("beforeunload", warn); return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  const set = useCallback((fn: (n: C) => void) => { setContent((c) => { const n = structuredClone(c as C); fn(n); return n; }); setDirty(true); }, []);

  const save = async () => {
    setSaving(true);
    try { await api("/api/admin/settings", { method: "PUT", body: JSON.stringify(content) }); setDirty(false); notify("Saved! Your changes will be live on the website in about 1–2 minutes."); }
    catch (err: any) { if (err.status === 401) setSession((x) => ({ ...(x as Session), loggedIn: false })); notify(err.message, "error"); }
    setSaving(false);
  };
  const discard = () => { if (window.confirm("Discard all unsaved changes?")) void loadContent(); };
  const logout = async () => {
    if (dirty && !window.confirm("You have unsaved changes. Log out anyway?")) return;
    await api("/api/admin/login", { method: "DELETE" }).catch(() => {}); setDirty(false); setContent(null); setSession((x) => ({ ...(x as Session), loggedIn: false }));
  };
  const go = (t: string) => { setTab(t); setMenuOpen(false); window.scrollTo({ top: 0 }); };

  if (!session) return <div className="adm-loading">Loading…</div>;
  if (!session.loggedIn) return <Login session={session} onDone={loadSession} />;
  const p = { c: content, set, notify, blob: session.blob };
  const current = TABS.find(([k]) => k === tab)?.[1];

  return (
    <div className="adm">
      <header className="adm-top">
        <button type="button" className="adm-menu-btn" aria-expanded={menuOpen} onClick={() => setMenuOpen((v) => !v)}><span aria-hidden>☰</span></button>
        <a className="adm-brand" href="/admin"><img src="/brand/logo.png" alt="VOBI Ministries" height="38" /></a>
        <div className="adm-top-title"><b>Website Admin</b><span>Manage your website content</span></div>
        <div className="adm-top-actions">
          <a className="adm-btn adm-btn-ghost adm-btn-small" href="/" target="_blank" rel="noopener noreferrer">◉ Preview Site</a>
          {dirty ? <button type="button" className="adm-btn adm-btn-ghost adm-btn-small" onClick={discard} disabled={saving}>Discard</button> : null}
          <button type="button" className="adm-btn adm-btn-small adm-publish" onClick={save} disabled={saving || !dirty || session.storage === "none"}>{saving ? "Saving…" : dirty ? "Publish" : "Published"}</button>
          <button type="button" className="adm-btn adm-btn-ghost adm-btn-small" onClick={logout}>Log out</button>
        </div>
      </header>
      <div className="adm-body">
        <nav id="adm-nav" className={`adm-nav ${menuOpen ? "open" : ""}`} aria-label="Admin sections">
          {TABS.map(([k, l]) => (<button type="button" key={k} className={tab === k ? "on" : ""} aria-current={tab === k ? "page" : undefined} onClick={() => go(k)}><i aria-hidden>{ICONS[k]}</i>{l}</button>))}
          <div className="adm-nav-foot"><b>VOBI Ministries</b><span>Victoria Falls, Zimbabwe</span><em>“Because of Christ we are saved.”</em></div>
        </nav>
        <main className="adm-main">
          {loadError ? <div className="adm-note error">{loadError} <button type="button" className="adm-btn adm-btn-small" onClick={loadContent}>Try again</button></div> : null}
          {!content && !loadError ? <div className="adm-loading">Loading content…</div> : null}
          {content ? (<>
            {tab === "overview" ? <Overview session={session} c={content} go={go} /> : null}
            {tab === "home" ? <HomeEditor {...p} /> : null}
            {tab === "videos" ? <VideosEditor {...p} /> : null}
            {tab === "events" ? <EventsEditor {...p} /> : null}
            {tab === "about" ? <AboutEditor {...p} /> : null}
            {tab === "ministries" ? <MinistriesEditor {...p} /> : null}
            {tab === "contact" ? <ContactEditor {...p} /> : null}
            {tab === "menu" ? <MenuEditor {...p} /> : null}
            {tab === "visitors" ? <VisitorsPanel notify={notify} /> : null}
            {tab === "moderation" ? <ModerationEditor notify={notify} /> : null}
          </>) : null}
        </main>
        <aside className="adm-aside">
          <MediaLibrary notify={notify} />
          <section className="adm-side-card"><h3>Page Settings</h3>
            <p className="adm-hint">Status: <b>{dirty ? "Unsaved changes" : "Published"}</b></p>
            <p className="adm-hint">Edits go live on the website about 1–2 minutes after you press Publish.</p>
          </section>
        </aside>
      </div>
      {toast ? <div className={`adm-toast ${toast.type}`} role="status" key={toast.id}>{toast.text}</div> : null}
    </div>
  );
}
