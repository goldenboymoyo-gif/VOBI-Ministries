import { NextResponse, connection } from "next/server";

import { clean, configured, throttle, uid, update } from "@/lib/store";
import { cookieHeader, hashPassword, newSalt, passwordMatches, pub, userFrom, userToken, type User } from "@/lib/userAuth";

const EMAIL = /^[^\s@]{1,64}@[^\s@]{1,190}\.[^\s@]{2,}$/;
const json = (b: object, init?: { status?: number; cookie?: string }) => {
  const r = NextResponse.json(b, { status: init?.status ?? 200 });
  if (init?.cookie) r.headers.set("Set-Cookie", init.cookie);
  return r;
};

function savePrefs(x: unknown): Pick<User, "cookies" | "prefs"> | null {
  const o = x as { preferences?: unknown; media?: unknown } | null;
  if (!o || typeof o !== "object") return null;
  const prefs = { preferences: o.preferences === true, media: o.media === true };
  return { prefs, cookies: prefs.preferences && prefs.media ? "accepted" : !prefs.preferences && !prefs.media ? "declined" : "custom" };
}

export async function GET(req: Request) {
  await connection();
  const u = await userFrom(req);
  return json({ user: u && !u.banned ? { ...pub(u), cookies: u.cookies ?? null } : null });
}

export async function POST(req: Request) {
  if (!configured() || !process.env.ADMIN_PASSWORD) return json({ error: "Accounts are not available yet." }, { status: 503 });
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0] ?? "x";
  if (!throttle(`a:${ip}`, 10, 60_000)) return json({ error: "Too many attempts. Try again in a minute." }, { status: 429 });
  const b = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  const action = String(b.action ?? "");

  if (action === "logout") return json({ ok: true }, { cookie: cookieHeader("", 0) });

  if (action === "consent") {
    const u = await userFrom(req); const p = savePrefs(b.prefs);
    if (u && p) await update<User[]>("users.json", [], (d) => d.map((x) => (x.id === u.id ? { ...x, ...p, consentAt: Date.now() } : x)));
    return json({ ok: true });
  }

  const email = clean(b.email, 120).toLowerCase();
  const password = String(b.password ?? "");
  if (!EMAIL.test(email)) return json({ error: "Enter a valid email address." }, { status: 400 });
  if (password.length < 8 || password.length > 100) return json({ error: "Password must be at least 8 characters." }, { status: 400 });

  if (action === "signup") {
    const name = clean(b.name, 40);
    if (name.length < 2) return json({ error: "Enter your name." }, { status: 400 });
    if (b.agree !== true) return json({ error: "Please accept the privacy policy and community rules." }, { status: 400 });
    const salt = newSalt(); const hash = await hashPassword(password, salt);
    const sp = savePrefs(b.cookies);
    const user: User = { id: uid(), name, email, phone: clean(b.phone, 30) || undefined, salt, hash, createdAt: Date.now(), ...(sp ?? {}), consentAt: sp ? Date.now() : undefined };
    let dup = false;
    await update<User[]>("users.json", [], (d) => { if (d.some((x) => x.email === email)) { dup = true; return d; } return [...d, user]; });
    if (dup) return json({ error: "That email already has an account. Log in instead." }, { status: 409 });
    return json({ user: pub(user) }, { cookie: cookieHeader(userToken(user.id)) });
  }

  if (action === "login") {
    const { load } = await import("@/lib/store");
    const u = (await load<User[]>("users.json", [])).find((x) => x.email === email);
    if (!u || !(await passwordMatches(password, u))) return json({ error: "Wrong email or password." }, { status: 401 });
    if (u.banned) return json({ error: "This account has been suspended. Please contact the ministry." }, { status: 403 });
    return json({ user: pub(u) }, { cookie: cookieHeader(userToken(u.id)) });
  }
  return json({ error: "Bad request" }, { status: 400 });
}
