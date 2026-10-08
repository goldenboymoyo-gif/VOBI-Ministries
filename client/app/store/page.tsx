import type { Metadata } from "next";

import { Masthead } from "@/components/ui/Masthead";
import { site } from "@/config/site";

export const metadata: Metadata = {
  title: "Store",
  description: "VOBI resources and merchandise.",
  alternates: { canonical: "/store" },
};

export default function StorePage() {
  return (
    <>
      <Masthead eyebrow="Store" title="VOBI Store" image="/photos/praise.jpg" intro="Resources and merchandise from VOBI." />
      <section className="bg-paper py-20 md:py-28">
        <div className="shell-narrow text-center">
          <h2 className="display-md">The store is not open yet</h2>
          <p className="mt-5 text-lg text-muted">We are preparing sermon resources and VOBI merchandise. Message us and we will tell you the moment it opens.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a href={`mailto:${site.email}?subject=VOBI%20Store`} className="btn btn-ink">Email us</a>
            <a href={`tel:${site.phone.replace(/\s+/g, "")}`} className="btn btn-ghost text-ink">Call</a>
          </div>
        </div>
      </section>
    </>
  );
}
