import type { Metadata } from "next";

import { Masthead } from "@/components/ui/Masthead";
import { AccountPanel } from "@/components/ui/AccountPanel";

export const metadata: Metadata = {
  title: "Sign in or sign up",
  description: "Create a free VOBI account to join the live chat.",
  alternates: { canonical: "/account" },
  robots: { index: false },
};

export default function AccountPage() {
  return (
    <>
      <Masthead image="/photos/congregation.jpg" eyebrow="Join the family" title="Sign in or sign up"
        intro="A free account lets you join the live chat with the VOBI family." />
      <section className="gold-wash py-12 md:py-16">
        <div className="shell"><AccountPanel /></div>
      </section>
    </>
  );
}
