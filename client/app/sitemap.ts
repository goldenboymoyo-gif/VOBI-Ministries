import type { MetadataRoute } from "next";

import { seedMinistries } from "@/content/ministries";
import { seedSermons, seedServices } from "@/content/sermons";


const BASE = "https://vobiministries.org";



export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    "",
    "/about",
    "/about/story",
    "/about/leadership",
    "/ministries",
    "/sermons",
    "/events",
    "/prayer", "/blog", "/devotionals", "/branches", "/give", "/store",
    "/testimonies",
    "/live",
    "/visit",
    "/contact",
  ].map((path) => ({
    url: `${BASE}${path}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: path === "" ? 1 : 0.7,
  }));

  const sermonRoutes: MetadataRoute.Sitemap = [...seedServices, ...seedSermons].map((s) => ({
    url: `${BASE}/sermons/${s.slug}`,
    lastModified: new Date(s.date),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const ministryRoutes: MetadataRoute.Sitemap = seedMinistries.map((m) => ({
    url: `${BASE}/ministries/${m.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...sermonRoutes, ...ministryRoutes];
}
