import { createHmac, randomBytes, scrypt as scryptCb, timingSafeEqual } from "node:crypto";

import { load } from "@/lib/store";

export const USER_COOKIE = "vobi_user";
const DAYS = 60;

export type User = {
  id: string; name: string; email: string; phone?: string; salt: string; hash: string; createdAt: number;
  cookies?: "accepted" | "declined" | "custom"; prefs?: { preferences: boolean; media: boolean }; consentAt?: number; banned?: boolean; photo?: string;
};
export type PublicUser = { id: string; name: string; email: string; avatar: string };

const scrypt = (p: string, salt: string) => new Promise<string>((res, rej) => scryptCb(p, salt, 32, (e, k) => (e ? rej(e) : res(k.toString("hex")))));
export const newSalt = () => randomBytes(16).toString("hex");
export const hashPassword = (p: string, salt: string) => scrypt(p, salt);
export async function passwordMatches(p: string, u: User) {
  const a = Buffer.from(await scrypt(p, u.salt)); const b = Buffer.from(u.hash);
  return a.length === b.length && timingSafeEqual(a, b);
}

const sign = (v: string) => createHmac("sha256", process.env.ADMIN_PASSWORD ?? "").update(`vobi-user:${v}`).digest("hex");
export const userToken = (id: string) => { const exp = String(Math.floor(Date.now() / 1000) + DAYS * 86400); return `${id}.${exp}.${sign(`${id}.${exp}`)}`; };
export const cookieHeader = (value: string, maxAge = DAYS * 86400) => `${USER_COOKIE}=${value}; Path=/; HttpOnly; SameSite=Lax; Secure; Max-Age=${maxAge}`;

export async function userFrom(req: Request): Promise<User | null> {
  if (!process.env.ADMIN_PASSWORD) return null;
  const c = req.headers.get("cookie") ?? "";
  const v = c.split(/;\s*/).find((x) => x.startsWith(`${USER_COOKIE}=`))?.slice(USER_COOKIE.length + 1) ?? "";
  const [id, exp, sig] = v.split(".");
  if (!id || !exp || !sig || !/^\d+$/.test(exp) || Number(exp) < Date.now() / 1000) return null;
  const want = sign(`${id}.${exp}`);
  if (sig.length !== want.length || !timingSafeEqual(Buffer.from(sig), Buffer.from(want))) return null;
  const users = await load<User[]>("users.json", []);
  return users.find((u) => u.id === id) ?? null;
}

export const pub = (u: User): PublicUser => ({ id: u.id, name: u.name, email: u.email, avatar: `/api/avatar/${u.id}` });
