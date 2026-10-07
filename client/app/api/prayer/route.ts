import { NextResponse, type NextRequest } from "next/server";

import { forward, validate } from "@/lib/inquiry";

export async function POST(req: NextRequest) {
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
