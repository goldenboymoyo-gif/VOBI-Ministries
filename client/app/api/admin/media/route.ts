import { NextResponse } from "next/server";
import { connection } from "next/server";

import { isAdmin } from "@/lib/adminAuth";
import { configured } from "@/lib/store";

export async function GET(req: Request) {
  await connection();
  if (!isAdmin(req)) return NextResponse.json({ error: "No" }, { status: 401 });
  if (!configured()) return NextResponse.json({ files: [] });
  const r = await fetch(`https://api.github.com/repos/${process.env.DATA_REPO}/contents/media`, {
    headers: { Authorization: `Bearer ${process.env.GITHUB_TOKEN}`, Accept: "application/vnd.github+json", "User-Agent": "vobi-site" },
    cache: "no-store",
  });
  if (!r.ok) return NextResponse.json({ files: [] });
  const list = (await r.json()) as { name: string; size: number }[];
  return NextResponse.json({ files: list.reverse().map((f) => ({ name: f.name, size: f.size, url: `/api/media/${f.name}` })) });
}
