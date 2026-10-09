import { redirect } from "next/navigation";

import { getMinistries } from "@/lib/data";

export async function generateStaticParams() {
  const list = await getMinistries();
  return list.map((m) => ({ slug: m.slug }));
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  redirect(`/ministries#${slug}`);
}
