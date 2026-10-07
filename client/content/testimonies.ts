import type { Testimony } from "@/types";
import { thumb } from "@/lib/media";

/**
 * Real testimony videos published by VOBI on its official channel.
 * See docs/vobi-research.md §7.4.
 *
 * `person` and `location` stay null until VOBI supplies approved names.
 * The website never writes a quotation on behalf of a real person.
 */
export const seedTestimonies: Testimony[] = [
  {
    id: "RyeE1nU4_Fw",
    slug: "he-almost-walked-out",
    title: "He Almost Walked Out… Until This Happened",
    youtubeUrl: "https://www.youtube.com/watch?v=RyeE1nU4_Fw",
    thumbnail: thumb("RyeE1nU4_Fw"),
    person: null,
    location: null,
  },
  {
    id: "j_v5biVaiXI",
    slug: "healing-from-graves-disease",
    title: "Miraculous Healing From Graves' Disease",
    youtubeUrl: "https://www.youtube.com/watch?v=j_v5biVaiXI",
    thumbnail: thumb("j_v5biVaiXI"),
    person: null,
    location: null,
  },
  {
    id: "rq5c5VmX_6o",
    slug: "from-stagnation-to-promotion",
    title: "From Stagnation to Promotion",
    youtubeUrl: "https://www.youtube.com/watch?v=rq5c5VmX_6o",
    thumbnail: thumb("rq5c5VmX_6o"),
    person: null,
    location: null,
  },
  {
    id: "wtGVNe2VVkQ",
    slug: "academic-and-job-breakthrough",
    title: "Academic and Job Breakthrough",
    youtubeUrl: "https://www.youtube.com/watch?v=wtGVNe2VVkQ",
    thumbnail: thumb("wtGVNe2VVkQ"),
    person: null,
    location: null,
  },
  {
    id: "It-rck1txVQ",
    slug: "blessed-with-two-cars",
    title: "This is how God blessed me with two cars",
    youtubeUrl: "https://www.youtube.com/watch?v=It-rck1txVQ",
    thumbnail: thumb("It-rck1txVQ"),
    person: null,
    location: null,
  },
  {
    id: "JEPx1WH3scc",
    slug: "tonsillitis-now-a-thing-of-the-past",
    title: "Tonsillitis Now A Thing Of The Past",
    youtubeUrl: "https://www.youtube.com/watch?v=JEPx1WH3scc",
    thumbnail: thumb("JEPx1WH3scc"),
    person: null,
    location: null,
  },
  {
    id: "z9tib6RxGqA",
    slug: "a-fathers-faith",
    title: "A Father's Faith Turns His Son's Academic Journey Around",
    youtubeUrl: "https://www.youtube.com/watch?v=z9tib6RxGqA",
    thumbnail: thumb("z9tib6RxGqA"),
    person: null,
    location: null,
  },
  {
    id: "VdifUDsVwJk",
    slug: "job-breakthrough",
    title: "Job Breakthrough Testimony",
    youtubeUrl: "https://www.youtube.com/watch?v=VdifUDsVwJk",
    thumbnail: thumb("VdifUDsVwJk"),
    person: null,
    location: null,
  },
];
