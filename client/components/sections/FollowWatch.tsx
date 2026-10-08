import { SocialIcon } from "@/components/ui/SocialLinks";

const channels = [
  { platform: "youtube", label: "YouTube", handle: "Prophet Promise Ministries", href: "https://www.youtube.com/@prophetpromiseministries4267" },
  { platform: "facebook", label: "Facebook", handle: "VOBI Ministries", href: "https://www.facebook.com/VOBI_Ministries" },
  { platform: "instagram", label: "Instagram", handle: "@vobiministries", href: "https://www.instagram.com/vobiministries" },
  { platform: "tiktok", label: "TikTok", handle: "@vobiministries", href: "https://www.tiktok.com/@vobiministries" },
] as const;

export function FollowWatch() {
  return (
    <section className="bg-gold-bright py-16 text-ink md:py-24">
      <div className="shell">
        <h2 className="display-md max-w-[20ch]">Watch the service wherever you are.</h2>
        <p className="mt-4 max-w-xl text-lg">
          Every Sunday meeting is broadcast live. Follow VOBI so you never miss a service, a miracle or a message.
        </p>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {channels.map((c) => (
            <a key={c.label} href={c.href} target="_blank" rel="noopener noreferrer"
               className="flex items-center gap-4 bg-ink p-5 text-paper transition-colors hover:bg-ink-700">
              <span className="text-gold-bright"><SocialIcon platform={c.platform} /></span>
              <span>
                <span className="block text-sm font-semibold">{c.label}</span>
                <span className="block text-xs text-paper/60">{c.handle}</span>
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
