import { NextResponse, connection } from "next/server";

import { clean, configured, load, throttle, uid, update, type Msg } from "@/lib/store";
import { userFrom } from "@/lib/userAuth";
import type { Report } from "@/app/api/chat/report/route";

type Stored = Msg & { uid?: string };
// Messages that break the community rules are flagged to the admin dashboard automatically.
const LINK = /(https?:\/\/|www\.|\b[a-z0-9-]+\.(com|net|org|co|xyz|ru|tk|ly|me)\b)/i;
const ABUSE = /\b(fuck|shit|bitch|bastard|asshole|idiot|stupid|nigger|whore|slut|dick|pussy|kill yourself)\b/i;

export async function GET(req: Request) {
  await connection();
  if (!configured()) return NextResponse.json({ off: true }, { status: 503 });
  const m = await load<Stored[]>("chat.json", []);
  const s = clean(new URL(req.url).searchParams.get("s"), 40) || "live";
  const messages = m.filter((x) => x.s === s).slice(-60).map(({ uid: u, ...rest }) => ({ ...rest, mine: undefined, u: u ? u.slice(0, 4) : undefined }));
  return NextResponse.json({ messages });
}

export async function POST(req: Request) {
  if (!configured()) return NextResponse.json({ off: true }, { status: 503 });
  const me = await userFrom(req);
  if (!me) return NextResponse.json({ error: "Sign up or log in to chat." }, { status: 401 });
  if (me.banned) return NextResponse.json({ error: "Your chat access has been suspended. Please contact the ministry." }, { status: 403 });
  if (!throttle(`c:${me.id}`, 6, 30_000)) return NextResponse.json({ error: "Slow down a little" }, { status: 429 });
  const b = (await req.json().catch(() => ({}))) as { text?: string; s?: string };
  const text = clean(b.text, 200); if (!text) return NextResponse.json({ error: "Empty" }, { status: 400 });
  const m: Stored = { id: uid(), name: me.name, text, at: Date.now(), s: clean(b.s, 40) || "live", uid: me.id };
  await update<Stored[]>("chat.json", [], (d) => [...d, m].slice(-200));
  const reason = LINK.test(text) ? "Contains a link" : ABUSE.test(text) ? "Offensive language" : "";
  if (reason) {
    const r: Report = { id: uid(), msgId: m.id, uid: me.id, name: me.name, text, reason: `Auto-flagged: ${reason}`, by: "System", at: Date.now(), open: true };
    await update<Report[]>("reports.json", [], (d) => [...d, r].slice(-300));
  }
  return NextResponse.json({ message: { id: m.id, name: m.name, text: m.text, at: m.at, u: me.id.slice(0, 4) } });
}
