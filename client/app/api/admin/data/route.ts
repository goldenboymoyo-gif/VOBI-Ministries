import { NextResponse } from "next/server";

import { isAdmin } from "@/lib/adminAuth";
import { load, update, type Comment, type Msg } from "@/lib/store";


export async function GET(req: Request) {
  if (!isAdmin(req)) return NextResponse.json({ error: "No" }, { status: 401 });
  const [comments, chat, likes] = await Promise.all([
    load<Record<string, Comment[]>>("comments.json", {}), load<Msg[]>("chat.json", []), load<Record<string, number>>("likes.json", {}),
  ]);
  return NextResponse.json({ comments, chat, likes });
}

export async function DELETE(req: Request) {
  if (!isAdmin(req)) return NextResponse.json({ error: "No" }, { status: 401 });
  const { kind, video, id } = (await req.json().catch(() => ({}))) as { kind?: string; video?: string; id?: string };
  if (kind === "comment" && video && id) await update<Record<string, Comment[]>>("comments.json", {}, (d) => ({ ...d, [video]: (d[video] ?? []).filter((c) => c.id !== id) }));
  else if (kind === "chat" && id) await update<Msg[]>("chat.json", [], (d) => d.filter((m) => m.id !== id));
  else if (kind === "chat-all") await update<Msg[]>("chat.json", [], () => []);
  else return NextResponse.json({ error: "Bad request" }, { status: 400 });
  return NextResponse.json({ ok: true });
}
