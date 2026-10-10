/**
 * VERIFIED CHRONOLOGY, docs/vobi-research.md §9.
 *
 * Every entry below is traceable to a VOBI publication or public listing.
 * There is no verified founding date and no verified founder story: those
 * fields do not exist here, and the UI does not display a founding year.
 */
export interface StoryEntry {
  year: string;
  title: string;
  body: string;
  source: string;
}

export const story: StoryEntry[] = [
  {
    year: "2016",
    title: "The earliest service we can date",
    body: "The oldest service carried on VOBI's official channel is titled simply 'SUNDAY 8 MAY 2016', a Sunday gathering recorded in Victoria Falls.",
    source: "VOBI official YouTube channel",
  },
  {
    year: "2017",
    title: "Mass Prayer becomes a rhythm",
    body: "Recordings from 21 May and 27 June 2017 establish the Mass Prayer gatherings that continue to this day, alongside 'Pray Along with Prophet Promise'.",
    source: "VOBI official YouTube channel",
  },
  {
    year: "2019",
    title: "The channel opens to the world",
    body: "On 7 February 2019 the PROPHET PROMISE MINISTRIES YouTube channel is created. That same February the ministry hosts an 'International Visitor's Experience' series and publishes a humanitarian documentary.",
    source: "YouTube channel record",
  },
  {
    year: "2019",
    title: "A visitor's note from across the border",
    body: "A public review on the ministry's listing, dated 21 April 2019, describes VOBI as a ministry 'touching lives in Zambia, Botswana, Namibia'.",
    source: "Public place listing (review)",
  },
  {
    year: "2023 to 2026",
    title: "Crossover, every year",
    body: "Candle Light Crossover services are published for 2023/24, 2024/25 and 2025/26, the most recent titled 'The Night of Exodus'.",
    source: "VOBI official YouTube channel",
  },
  {
    year: "Today",
    title: "882 videos and counting",
    body: "VOBI's official channel now holds 882 published videos, Sunday services, sermons, mass prayer, testimonies and outreach, with 9,516 followers on the ministry's official Facebook page.",
    source: "YouTube & Facebook, October 2026",
  },
];

/** CONTENT NEEDED, VOBI: founding date, founder story, building history. */
export const missingHistory = [
  "Founding date",
  "Founder biography",
  "Church building & locations history",
  "Leadership biography for Prophet Promise",
];
