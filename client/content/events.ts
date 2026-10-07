import type { ChurchEvent } from "@/types";

/**
 * VERIFIED UPCOMING EVENTS ONLY.
 *
 * No VOBI event with a confirmed future date could be found in public sources
 * at the time of writing (docs/vobi-research.md §4). This array is
 * intentionally empty — the UI renders a graceful invitation to follow VOBI's
 * official channels instead of inventing a date, venue or registration link.
 *
 * When VOBI supplies an event, add it here (or via the admin API):
 * {
 *   id: "", slug: "", title: "", date: "2026-01-01",
 *   time: null, location: null, description: "",
 *   image: null, registrationUrl: null
 * }
 */
export const seedEvents: ChurchEvent[] = [];

/**
 * Recurring gatherings that ARE verified from VOBI's own published content,
 * shown as context (not as dated events) so visitors know they exist.
 */
export const recurringGatherings = [
  {
    title: "Sunday Live Service",
    evidence:
      "Near-weekly live broadcasts throughout 2026, titled 'SUNDAY LIVE SERVICE | <date> | VOBI MINISTRIES'.",
  },
  {
    title: "Mass Prayer",
    evidence:
      "Seventy published titles contain 'MASS PRAYER', spanning 2017 to the present.",
  },
  {
    title: "Crossover Candle Light Service",
    evidence:
      "Annual 31 December gathering, titled across 2023→24, 2024→25 and 2025→26 — most recently 'The Night of Exodus'.",
  },
  {
    title: "Mercy Land / Holy Ground",
    evidence:
      "Recurring service naming: 'MERCYLAND SUNDAY SERVICE' and 'A Special invitation for you this Sunday to the Holy Ground!!!'",
  },
] as const;
