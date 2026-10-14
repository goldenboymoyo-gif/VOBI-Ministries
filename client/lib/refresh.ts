import { revalidatePath, revalidateTag } from "next/cache";

/** Call after anything is saved from the admin page, so the live site shows it straight away instead of after the cache expires. */
export function refreshSite() {
  try { revalidateTag("site", { expire: 0 }); } catch {}
  try { revalidatePath("/", "layout"); } catch {}
}
