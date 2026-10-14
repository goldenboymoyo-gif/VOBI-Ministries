import { NextResponse } from "next/server";
import { createHash } from "node:crypto";

import { configured, load } from "@/lib/store";
import type { User } from "@/lib/userAuth";

type Ctx = { params: Promise<{ id: string }> };

/** A member's picture: the one they uploaded, otherwise the one their email address uses (Gravatar), otherwise 404 (the site shows their initial). */
export async function GET(_: Request, { params }: Ctx) {
  const { id } = await params;
  if (!/^[\w-]{4,40}$/.test(id) || !configured()) return new NextResponse(null, { status: 404 });
  const u = (await load<User[]>("users.json", [])).find((x) => x.id === id);
  if (!u || u.banned) return new NextResponse(null, { status: 404 });
  if (u.photo?.startsWith("data:image/jpeg;base64,")) {
    return new NextResponse(Buffer.from(u.photo.slice(23), "base64"), { headers: { "Content-Type": "image/jpeg", "Cache-Control": "public, max-age=300, stale-while-revalidate=3600" } });
  }
  const h = createHash("sha256").update(u.email.trim().toLowerCase()).digest("hex");
  return NextResponse.redirect(`https://www.gravatar.com/avatar/${h}?s=96&d=404`, { status: 307, headers: { "Cache-Control": "public, max-age=3600" } });
}
