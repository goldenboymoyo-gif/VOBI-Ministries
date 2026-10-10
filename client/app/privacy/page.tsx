import type { Metadata } from "next";
import Link from "next/link";

import { Masthead } from "@/components/ui/Masthead";
import { site } from "@/config/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `How Valley of Blessings International Ministries handles the information you share through this website.`,
  alternates: { canonical: "/privacy" },
};

const sections = [
  {
    title: "What this website collects",
    body: [
      "This website collects what you choose to type into its contact and prayer request forms (your name, contact details and message), and the name and text you enter if you post a comment or a live chat message.",
      "The website does not use advertising trackers, profiling cookies or analytics scripts. Our hosting provider keeps standard server logs (such as IP address and pages requested) for security and reliability.",
    ],
  },
  {
    title: "How your message is used",
    body: [
      "Messages and prayer requests are sent to the ministry by email so that the ministry can respond to you, through an email-forwarding service (FormSubmit). Prayer requests are held privately by the ministry and are never published, listed or shared on this website.",
      "Comments and live chat messages you post are public and are stored in a private data store used by this website. Likes are stored as a count. The ministry can remove any comment or message.",
      "Your details are not sold, traded or used for marketing of any kind.",
    ],
  },
  {
    title: "Third-party services",
    body: [
      "This website embeds video from YouTube (using the privacy-enhanced youtube-nocookie.com address) and a Google map on some pages, and is hosted on Vercel. Those services handle data under their own privacy policies and may set their own cookies when you press play or load the map. See our Cookie Policy.",
      "Links to VOBI's official social channels open those platforms directly.",
    ],
  },
  {
    title: "Contact",
    body: [
      `Questions about this policy can be sent to ${site.email}, or by telephone on ${site.phone}.`,
      "You can ask us to correct or delete a message, prayer request or comment you sent by contacting us. We keep contact messages and prayer requests for up to 12 months, then delete them.",
      "Final policy text is subject to approval by Valley of Blessings International Ministries.",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <>
      <Masthead
        eyebrow="Legal"
        crumbs={[{ label: "Home", href: "/" }, { label: "Privacy Policy" }]}
        title="Privacy Policy"
        intro="What this website collects and what it never does with it."
      />

      <section className="border-b border-line bg-paper py-20 md:py-28">
        <div className="shell-narrow">
          <div className="reveal space-y-12">
            {sections.map((s) => (
              <div key={s.title}>
                <h2 className="display-sm">{s.title}</h2>
                <div className="mt-5 space-y-4 text-[15.5px] leading-relaxed text-muted">
                  {s.body.map((p) => (
                    <p key={p.slice(0, 32)}>{p}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="reveal mt-14 flex flex-wrap gap-3">
            <Link href="/contact" className="btn btn-ink">
              Contact the ministry
            </Link>
            <Link href="/cookies" className="btn btn-ghost text-ink">
              Cookie Policy
            </Link>
            <Link href="/terms" className="btn btn-ghost text-ink">
              Terms of Service
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
