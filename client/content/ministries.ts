import type { Ministry } from "@/types";
import { site } from "@/config/site";
import { thumb } from "@/lib/media";

/**
 * Only ministries evidenced by VOBI's own published content are listed.
 * See docs/vobi-research.md §5. Youth / Women's / Children's departments are
 * deliberately absent — they could not be confirmed and are not invented.
 */
export const seedMinistries: Ministry[] = [
  {
    id: "m-sunday",
    slug: "sunday-worship",
    name: "Sunday Worship",
    summary:
      "The whole church gathers around the Word with Prophet Promise — teaching, worship and ministry, broadcast live from Victoria Falls.",
    body: [
      "Sunday is the centre of VOBI's week. The service is preached from Scripture by Prophet Promise and carried live to viewers around the globe on the ministry's official YouTube channel.",
      "Services run long because the ministry does not hurry the presence of God — recent Sunday broadcasts have run past seven hours, with preaching, worship, mass prayer and ministry to individuals.",
      "Distance is not a barrier to the move of the Holy Spirit. If you cannot be in Victoria Falls, you can join the service live.",
    ],
    image: thumb("zS8NL8NMNlQ"),
    gathering: `${site.service.day} gatherings begin at ${site.service.time} and end when the Holy Spirit gives a signal.`,
  },
  {
    id: "m-prayer",
    slug: "prayer",
    name: "Prayer & Mass Prayer",
    summary:
      "Mass prayer, the prayer line and 'Pray Along with Prophet Promise' — the ministry's longest-running weekly expression.",
    body: [
      "Prayer is the oldest continuous thread in VOBI's public ministry. Mass Prayer recordings appear on the ministry's channel as far back as 2017, alongside the recurring 'Pray Along with Prophet Promise' prayer-line services.",
      "Requests submitted through this website are held privately and are never published, listed or shared.",
      "Teaching on prayer is a recurring subject in the sermon library, including the two-part series 'How to get your prayers answered'.",
    ],
    image: thumb("aCLyo-8DdaM"),
    gathering: null, // CONTENT NEEDED — VOBI prayer line schedule
  },
  {
    id: "m-testimony",
    slug: "testimonies-deliverance",
    name: "Testimonies & Deliverance",
    summary:
      "Over a hundred published testimonies — healing, breakthrough, family restoration and deliverance, told by the people who lived them.",
    body: [
      "More than a hundred videos on VOBI's official channel carry the word 'testimony'. They are published by the ministry, in the words of the people involved.",
      "Deliverance ministry is a regular feature of services, recorded in titles spanning from 2017 to the present day.",
      "The Testimonies page links directly to VOBI's own published testimony videos. No testimony on this website is written, paraphrased or summarised on anyone's behalf.",
    ],
    image: thumb("RyeE1nU4_Fw"),
    gathering: null,
  },
  {
    id: "m-humanitarian",
    slug: "humanitarian-outreach",
    name: "Humanitarian & Outreach",
    summary:
      "A documented humanitarian programme and cross-border outreach into Botswana, Zambia and the wider region.",
    body: [
      "VOBI has published a humanitarian documentary, a standing 'Humanitarian Program', and outreach recordings under titles including 'Botswana Outreach' and 'Zambia KuChalo!'.",
      "A visitor review on the ministry's public listing, dated April 2019, describes the work as 'touching lives in Zambia, Botswana, Namibia'.",
      "To support or partner with the outreach, contact the ministry on the Give page.",
    ],
    image: thumb("km9II2XvBiY"),
    gathering: null,
  },
];
