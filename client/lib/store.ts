// Small JSON database kept in a private GitHub repo (DATA_REPO), read and written through the GitHub API.
const API = "https://api.github.com/repos";

export function configured() {
  return Boolean(process.env.GITHUB_TOKEN && process.env.DATA_REPO);
}

function headers() {
  return { Authorization: `Bearer ${process.env.GITHUB_TOKEN}`, Accept: "application/vnd.github+json", "User-Agent": "vobi-site" };
}

async function read<T>(file: string, fallback: T): Promise<{ data: T; sha?: string }> {
  const r = await fetch(`${API}/${process.env.DATA_REPO}/contents/${file}`, { headers: headers(), cache: "no-store" });
  if (r.status === 404) return { data: fallback };
  if (!r.ok) throw new Error(`store read ${r.status}`);
  const j = (await r.json()) as { content: string; sha: string };
  return { data: JSON.parse(Buffer.from(j.content, "base64").toString("utf8")) as T, sha: j.sha };
}

export async function load<T>(file: string, fallback: T): Promise<T> {
  return (await read(file, fallback)).data;
}

export async function update<T>(file: string, fallback: T, fn: (d: T) => T): Promise<T> {
  for (let i = 0; i < 3; i++) {
    const { data, sha } = await read(file, fallback);
    const next = fn(data);
    const r = await fetch(`${API}/${process.env.DATA_REPO}/contents/${file}`, {
      method: "PUT", headers: headers(),
      body: JSON.stringify({ message: `update ${file}`, content: Buffer.from(JSON.stringify(next, null, 1)).toString("base64"), sha }),
    });
    if (r.ok) return next;
    if (r.status !== 409 && r.status !== 422) throw new Error(`store write ${r.status}`);
  }
  throw new Error("store busy");
}

export type Comment = { id: string; name: string; text: string; at: number };
export type Msg = { id: string; name: string; text: string; at: number };

export const clean = (s: unknown, max: number) => String(s ?? "").replace(/[\u0000-\u001f]+/g, " ").trim().slice(0, max);
export const uid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36);

const hits = new Map<string, number[]>();
export function throttle(key: string, limit: number, ms: number) {
  const now = Date.now();
  const list = (hits.get(key) ?? []).filter((t) => now - t < ms);
  if (list.length >= limit) return false;
  list.push(now); hits.set(key, list);
  return true;
}

export async function putBinary(file: string, base64: string) {
  const r = await fetch(`${API}/${process.env.DATA_REPO}/contents/${file}`, {
    method: "PUT", headers: headers(), body: JSON.stringify({ message: `upload ${file}`, content: base64 }),
  });
  if (!r.ok) throw new Error(`store upload ${r.status}`);
}

export async function rawFile(file: string): Promise<ArrayBuffer | null> {
  const r = await fetch(`${API}/${process.env.DATA_REPO}/contents/${file}`, { headers: { ...headers(), Accept: "application/vnd.github.raw" }, cache: "no-store" });
  return r.ok ? r.arrayBuffer() : null;
}
