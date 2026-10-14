import { NextResponse } from "next/server";

import { isAdmin } from "@/lib/adminAuth";
import { load, update, type Comment, type Msg } from "@/lib/store";
import type { Inquiry } from "@/lib/inquiry";
import type { User } from "@/lib/userAuth";
import type { Report } from "@/app/api/chat/report/route";

export async function GET(req: Request) {
  if (!isAdmin(req)) return NextResponse.json({ error: "No" }, { status: 401 });
  const [comments, chat, likes, users, reports, inquiries, visits] = await Promise.all([
    load<Record<string, Comment[]>>("comments.json", {}), load<Msg[]>("chat.json", []), load<Record<string, number>>("likes.json", {}),
    load<User[]>("users.json", []), load<Report[]>("reports.json", []), load<Inquiry[]>("inquiries.json", []), load<Record<string, unknown>>("visits.json", {}),
  ]);
  // Never send password hashes to the browser.
  const members = users.map(({ salt: _s, hash: _h, photo: _p, ...u }) => u);
  return NextResponse.json({ comments, chat, likes, users: members, reports, inquiries, visits: Object.fromEntries(Object.entries(visits as Record<string, { seen?: string[] }>).map(([k, v]) => { const { seen: _s, ...rest } = v; return [k, rest]; })) });
}

export async function DELETE(req: Request) {
  if (!isAdmin(req)) return NextResponse.json({ error: "No" }, { status: 401 });
  const { kind, video, id } = (await req.json().catch(() => ({}))) as { kind?: string; video?: string; id?: string };
  if (kind === "comment" && video && id) await update<Record<string, Comment[]>>("comments.json", {}, (d) => ({ ...d, [video]: (d[video] ?? []).filter((c) => c.id !== id) }));
  else if (kind === "chat" && id) await update<Msg[]>("chat.json", [], (d) => d.filter((m) => m.id !== id));
  else if (kind === "chat-all") await update<Msg[]>("chat.json", [], () => []);
  else if (kind === "inquiry" && id) await update<Inquiry[]>("inquiries.json", [], (d) => d.filter((r) => r.id !== id));
  else if (kind === "report" && id) await update<Report[]>("reports.json", [], (d) => d.filter((r) => r.id !== id));
  else return NextResponse.json({ error: "Bad request" }, { status: 400 });
  return NextResponse.json({ ok: true });
}

export async function PATCH(req: Request) {
  if (!isAdmin(req)) return NextResponse.json({ error: "No" }, { status: 401 });
  const { kind, id, banned } = (await req.json().catch(() => ({}))) as { kind?: string; id?: string; banned?: boolean };
  if (kind === "ban" && id) await update<User[]>("users.json", [], (d) => d.map((u) => (u.id === id ? { ...u, banned: Boolean(banned) } : u)));
  else if (kind === "resolve" && id) await update<Report[]>("reports.json", [], (d) => d.map((r) => (r.id === id ? { ...r, open: false } : r)));
  else return NextResponse.json({ error: "Bad request" }, { status: 400 });
  return NextResponse.json({ ok: true });
}
