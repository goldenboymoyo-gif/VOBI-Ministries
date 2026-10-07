export type SermonCategory = "sermon" | "teaching" | "service" | "special";

export interface Sermon {
  id: string;
  slug: string;
  title: string;
  speaker: string;
  date: string; // ISO 8601 (YYYY-MM-DD)
  thumbnail: string;
  youtubeUrl: string;
  category: SermonCategory;
  description?: string;
  durationSeconds?: number;
  views?: number;
}

export interface ChurchEvent {
  id: string;
  slug: string;
  title: string;
  date: string; // ISO 8601
  time?: string | null;
  location?: string | null;
  description?: string;
  image?: string | null;
  registrationUrl?: string | null;
}

export interface Ministry {
  id: string;
  slug: string;
  name: string;
  summary: string;
  body: string[];
  image: string;
  gathering?: string | null;
}

export interface Testimony {
  id: string;
  slug: string;
  title: string;
  youtubeUrl: string;
  thumbnail: string;
  publishedAt?: string | null;
  /** Only set when VOBI supplies an approved name. Never invented. */
  person?: string | null;
  location?: string | null;
}

export interface SocialLink {
  platform: "youtube" | "facebook" | "instagram" | "tiktok" | "whatsapp";
  label: string;
  url: string;
}

export interface ServiceInfo {
  day: string | null;
  time: string | null;
  note: string | null;
}

export interface SiteSettings {
  name: string;
  shortName: string;
  fullName: string;
  city: string;
  country: string;
  address: string;
  phone: string;
  /** Prayer / direct contact line supplied by VOBI. */
  prayerPhone: string;
  email: string;
  coordinates: { lat: number; lng: number };
  service: ServiceInfo;
  /** Verified phrases only — sourced from VOBI's own published copy. */
  statements: {
    bioLine: string;
    welcome: string;
    distance: string;
  };
}
