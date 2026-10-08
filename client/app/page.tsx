import { FeatureCards } from "@/components/sections/FeatureCards";
import { BrandVideo } from "@/components/sections/BrandVideo";
import { FollowWatch } from "@/components/sections/FollowWatch";
import { Hero } from "@/components/sections/Hero";
import { Word } from "@/components/sections/Word";
import { Leadership } from "@/components/sections/Leadership";
import { Testimonies } from "@/components/sections/Testimonies";
import { NeedPrayer } from "@/components/sections/NeedPrayer";
import { VisitSection } from "@/components/sections/VisitSection";

import { getSermons, getTestimonies } from "@/lib/data";

export default async function HomePage() {
  const [sermons, testimonies] = await Promise.all([
    getSermons(),
    getTestimonies(),
  ]);

  const latestSermon = sermons.find((s) => s.category !== "service") ?? sermons[0];

  return (
    <>
      <Hero />
      <FeatureCards />
      <Word latest={latestSermon} total={sermons.length} />
      <Leadership />
      <Testimonies testimonies={testimonies} />
      <BrandVideo />
      <FollowWatch />
      <NeedPrayer />
      <VisitSection />
    </>
  );
}
