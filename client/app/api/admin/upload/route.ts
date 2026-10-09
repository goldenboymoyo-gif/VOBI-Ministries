import { NextResponse } from "next/server";

import { isAdmin } from "@/lib/adminAuth";
import { putBinary, uid } from "@/lib/store";

export async function POST(req: Request) {
  if (!isAdmin(req)) return NextResponse.json({ error: "No" }, { status: 401 });
  const { data } = (await req.json().catch(() => ({}))) as { data?: string };
  const m = String(data ?? "").match(/^data:image\/(jpeg|png|webp);base64,([A-Za-z0-9+/=]+)$/);
  if (!m) return NextResponse.json({ error: "Choose a JPG, PNG or WebP picture" }, { status: 400 });
  if (m[2].length > 4_000_000) return NextResponse.json({ error: "Picture is too large" }, { status: 400 });
  const name = `${uid()}.${m[1] === "jpeg" ? "jpg" : m[1]}`;
  await putBinary(`media/${name}`, m[2]);
  return NextResponse.json({ url: `/api/media/${name}` });
}
