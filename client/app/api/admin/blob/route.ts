import { NextResponse } from "next/server";
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";

import { isAdmin } from "@/lib/adminAuth";

export async function POST(req: Request) {
  if (!isAdmin(req)) return NextResponse.json({ error: "No" }, { status: 401 });
  if (!process.env.BLOB_READ_WRITE_TOKEN) return NextResponse.json({ error: "Video storage is not switched on yet" }, { status: 503 });
  const body = (await req.json()) as HandleUploadBody;
  try {
    const json = await handleUpload({
      body, request: req,
      onBeforeGenerateToken: async () => ({ allowedContentTypes: ["video/mp4", "video/webm", "video/quicktime"], maximumSizeInBytes: 600 * 1024 * 1024, addRandomSuffix: true }),
      onUploadCompleted: async () => {},
    });
    return NextResponse.json(json);
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 400 });
  }
}
