import { createHmac, timingSafeEqual } from "node:crypto";

export const COOKIE = "vobi_admin";
export const SESSION_SECONDS = 60 * 60 * 8;

const sign = (exp: string) => createHmac("sha256", process.env.ADMIN_PASSWORD ?? "").update(`vobi-admin:${exp}`).digest("hex");

/** Session value: "<expiry-unix-seconds>.<hmac>". Expires on the server, not just in the browser. */
export const token = () => {
  const exp = String(Math.floor(Date.now() / 1000) + SESSION_SECONDS);
  return `${exp}.${sign(exp)}`;
};

export function passwordOk(p: string) {
  const a = Buffer.from(createHmac("sha256", "x").update(p).digest("hex"));
  const b = Buffer.from(createHmac("sha256", "x").update(process.env.ADMIN_PASSWORD ?? "\u0000none").digest("hex"));
  return Boolean(process.env.ADMIN_PASSWORD) && timingSafeEqual(a, b);
}

export function isAdmin(req: Request) {
  if (!process.env.ADMIN_PASSWORD) return false;
  const c = req.headers.get("cookie") ?? "";
  const v = c.split(/;\s*/).find((x) => x.startsWith(`${COOKIE}=`))?.slice(COOKIE.length + 1) ?? "";
  const [exp, sig] = v.split(".");
  if (!exp || !sig || !/^\d+$/.test(exp) || Number(exp) < Date.now() / 1000) return false;
  const want = sign(exp);
  return sig.length === want.length && timingSafeEqual(Buffer.from(sig), Buffer.from(want));
}
