import type { Metadata } from "next";
import { Suspense } from "react";

import { Masthead } from "@/components/ui/Masthead";
import { SermonLibrary } from "@/components/sections/SermonLibrary";
import { getSermons } from "@/lib/data";

export const metadata: Metadata = {
  title: "Sermons & Services",
  description:
    "The complete sermon, teaching and live service library from Valley of Blessings International Ministries — every message ministered by Prophet Promise and published on VOBI's official channel.",
  alternates: { canonical: "/sermons" },
};

export default async function SermonsPage() {
  const sermons = await getSermons();

  return (
    <>
      <Masthead image="/photos/hero.jpg"
        eyebrow="VOBI TV"
        crumbs={[{ label: "Home", href: "/" }, { label: "Sermons" }]}
        title="Sermons & Services"
        intro="Every message from Prophet Promise."
      />

      <section className="bg-paper py-16 md:py-24">
        <div className="shell">
          <Suspense fallback={<p className="text-muted">Loading the library…</p>}>
            <SermonLibrary sermons={sermons} />
          </Suspense>
        </div>
      </section>
    </>
  );
}
