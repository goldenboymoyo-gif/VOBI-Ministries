import { createHmac, timingSafeEqual } from "node:crypto";

export const COOKIE = "vobi_admin";
export const token = () => createHmac("sha256", process.env.ADMIN_PASSWORD ?? "").update("vobi-admin").digest("hex");

export function passwordOk(p: string) {
  const a = Buffer.from(createHmac("sha256", "x").update(p).digest("hex"));
  const b = Buffer.from(createHmac("sha256", "x").update(process.env.ADMIN_PASSWORD ?? "\u0000none").digest("hex"));
  return Boolean(process.env.ADMIN_PASSWORD) && timingSafeEqual(a, b);
}

export function isAdmin(req: Request) {
  const c = req.headers.get("cookie") ?? "";
  const v = c.split(/;\s*/).find((x) => x.startsWith(`${COOKIE}=`))?.slice(COOKIE.length + 1) ?? "";
  const t = token();
  return Boolean(process.env.ADMIN_PASSWORD) && v.length === t.length && timingSafeEqual(Buffer.from(v), Buffer.from(t));
}
