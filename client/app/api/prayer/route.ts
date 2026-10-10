import { NextResponse, type NextRequest } from "next/server";

import { forward, validate } from "@/lib/inquiry";
import { throttle } from "@/lib/store";

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "x";
  if (!throttle(`p:${ip}`, 5, 600_000)) return NextResponse.json({ error: "Too many messages. Please try again later." }, { status: 429 });
  if (Number(req.headers.get("content-length") ?? 0) > 20_000) return NextResponse.json({ error: "Request too large." }, { status: 413 });
  let input: Record<string, unknown>;
  try {
    input = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const result = validate("prayer", input as never);
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 422 });
  }

  const res = await forward("prayer", result.payload);
  if (res.status >= 400) {
    const body = res.body as { error?: string } | null;
    return NextResponse.json(
      { error: body?.error ?? "Could not send your request." },
      { status: res.status >= 500 ? 503 : res.status },
    );
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
