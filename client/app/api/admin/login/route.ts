import { NextResponse } from "next/server";

import { COOKIE, isAdmin, passwordOk, token } from "@/lib/adminAuth";
import { throttle } from "@/lib/store";

export async function GET(req: Request) {
  return NextResponse.json({
    loggedIn: isAdmin(req), configured: Boolean(process.env.ADMIN_PASSWORD),
    storage: process.env.GITHUB_TOKEN && process.env.DATA_REPO ? "github" : "none", blob: Boolean(process.env.BLOB_READ_WRITE_TOKEN),
  });
}

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0] ?? "x";
  if (!throttle(`a:${ip}`, 6, 600_000)) return NextResponse.json({ error: "Try again later" }, { status: 429 });
  const { password } = (await req.json().catch(() => ({}))) as { password?: string };
  if (!password || !passwordOk(password)) return NextResponse.json({ error: "Wrong password" }, { status: 401 });
  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE, token(), { httpOnly: true, secure: true, sameSite: "strict", path: "/", maxAge: 60 * 60 * 12 });
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE, "", { httpOnly: true, secure: true, sameSite: "strict", path: "/", maxAge: 0 });
  return res;
}
