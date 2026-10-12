import { NextResponse } from "next/server";

import { clean, configured, load, throttle, uid, update } from "@/lib/store";
import { userFrom } from "@/lib/userAuth";
import type { Msg } from "@/lib/store";

export type Report = { id: string; msgId: string; uid?: string; name: string; text: string; reason: string; by: string; at: number; open: boolean };

export async function POST(req: Request) {
  if (!configured()) return NextResponse.json({ off: true }, { status: 503 });
  const me = await userFrom(req);
  if (!me || me.banned) return NextResponse.json({ error: "Log in to report a message." }, { status: 401 });
  if (!throttle(`r:${me.id}`, 5, 60_000)) return NextResponse.json({ error: "Slow down a little" }, { status: 429 });
  const b = (await req.json().catch(() => ({}))) as { id?: string; reason?: string };
  const m = (await load<Msg[]>("chat.json", [])).find((x) => x.id === b.id);
  if (!m) return NextResponse.json({ error: "Message not found" }, { status: 404 });
  const r: Report = { id: uid(), msgId: m.id, uid: (m as Msg & { uid?: string }).uid, name: m.name, text: m.text, reason: clean(b.reason, 80) || "Reported by a viewer", by: me.name, at: Date.now(), open: true };
  await update<Report[]>("reports.json", [], (d) => [...d, r].slice(-300));
  return NextResponse.json({ ok: true });
}
