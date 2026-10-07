import type { SiteSettings } from "@/types";

/**
 * Verified site settings.
 *
 * Every value here is traceable to docs/vobi-research.md. Anything VOBI has
 * not supplied is `null` and renders as a CONTENT NEEDED state in the UI —
 * it is never filled with a guess.
 */
export const site: SiteSettings = {
  name: "VOBI",
  shortName: "VOBI",
  fullName: "Valley of Blessings International Ministries",
  city: "Victoria Falls",
  country: "Zimbabwe",

  // Listing source: africabizinfo / exa place record (research §3)
  address: "8875 CBZ, Mkhosana, Victoria Falls, Zimbabwe",
  phone: "+263 775 879 390",

  // Supplied directly by VOBI (research §5) — used for prayer and general contact.
  email: "prophetpromise1@gmail.com",
  prayerPhone: "+263 713 901 112",

  // Coordinates from the public place listing (research §3)
  coordinates: { lat: -17.939334, lng: 25.822199 },

  // Supplied directly by VOBI (research §5).
  service: {
    day: "Sunday",
    time: "08:30",
    note: "Services begin at 08:30 and end when the Holy Spirit gives a signal.",
  },

  statements: {
    // Verbatim first line of VOBI's official Facebook biography.
    bioLine: "Because of Christ we are saved.",
    // Verbatim from VOBI's official Sunday service descriptions.
    welcome:
      "Viewers around the globe, welcome to the Sunday service in the presence of God Almighty in VOBI Ministries with the man of God Prophet Promise.",
    // Recurring line in VOBI's own titles and descriptions.
    distance: "Distance is not a barrier to the Spirit of God.",
  },
};

export const nav = [
  { label: "Home", href: "/" },
  {
    label: "About",
    href: "/about",
    children: [
      { label: "Our Story", href: "/about/story" },
      { label: "Leadership", href: "/about/leadership" },
    ],
  },
  { label: "Ministries", href: "/ministries" },
  { label: "Sermons", href: "/sermons" },
  { label: "Events", href: "/events" },
  { label: "Prayer", href: "/prayer" },
];

export const navActions = [
  { label: "Watch Live", href: "/live", variant: "ghost" as const },
  { label: "Plan Your Visit", href: "/visit", variant: "solid" as const },
];

export function mapsDirectionsUrl(): string {
  const { lat, lng } = site.coordinates;
  return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
}

export function mapsEmbedUrl(): string {
  const { lat, lng } = site.coordinates;
  const d = 0.012;
  const bbox = `${lng - d},${lat - d / 1.6},${lng + d},${lat + d / 1.6}`;
  return `https://www.openstreetmap.org/export/embed.html?bbox=${encodeURIComponent(
    bbox,
  )}&layer=mapnik&marker=${lat},${lng}`;
}
