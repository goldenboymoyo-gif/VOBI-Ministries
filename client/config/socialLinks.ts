import type { SocialLink } from "@/types";

/**
 * Centralised social configuration.
 *
 * ONLY verified official accounts belong here. Evidence is documented in
 * docs/vobi-research.md §6. If an account cannot be verified it is not
 * listed, the footer renders only what exists in this array.
 *
 * Adding a platform here automatically surfaces it in the footer.
 */
export const socialLinks: SocialLink[] = [
  {
    platform: "youtube",
    label: "YouTube",
    url: "https://www.youtube.com/@prophetpromiseministries4267",
  },
  {
    platform: "facebook",
    label: "Facebook",
    url: "https://www.facebook.com/VOBI_Ministries/",
  },
  {
    platform: "instagram",
    label: "Instagram",
    url: "https://www.instagram.com/vobiministries/",
  },
  {
    platform: "tiktok",
    label: "TikTok",
    url: "https://www.tiktok.com/@vobiministries",
  },
];
