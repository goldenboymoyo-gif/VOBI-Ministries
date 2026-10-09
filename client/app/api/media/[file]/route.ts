import { configured, rawFile } from "@/lib/store";

const TYPES: Record<string, string> = { jpg: "image/jpeg", png: "image/png", webp: "image/webp" };

export async function GET(_: Request, { params }: { params: Promise<{ file: string }> }) {
  const { file } = await params;
  const m = file.match(/^[\w-]{4,40}\.(jpg|png|webp)$/);
  if (!m || !configured()) return new Response("Not found", { status: 404 });
  const data = await rawFile(`media/${file}`);
  if (!data) return new Response("Not found", { status: 404 });
  return new Response(data, { headers: { "Content-Type": TYPES[m[1]], "Cache-Control": "public, max-age=31536000, immutable" } });
}
