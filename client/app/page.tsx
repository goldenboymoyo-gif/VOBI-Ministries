import { Hero } from "@/components/sections/Hero";
import { WelcomeToVobi } from "@/components/sections/WelcomeToVobi";
import { UpcomingEvents } from "@/components/sections/UpcomingEvents";
import { StatementOfFaith } from "@/components/sections/StatementOfFaith";
import { TheMinistry } from "@/components/sections/TheMinistry";
import { WatchVobi } from "@/components/sections/WatchVobi";
import { Word } from "@/components/sections/Word";
import { Leadership } from "@/components/sections/Leadership";
import { Testimonies } from "@/components/sections/Testimonies";
import { NeedPrayer } from "@/components/sections/NeedPrayer";
import { VisitSection } from "@/components/sections/VisitSection";

import { getEvents, getSermons, getTestimonies } from "@/lib/data";

export default async function HomePage() {
  const [sermons, events, testimonies] = await Promise.all([
    getSermons(),
    getEvents(),
    getTestimonies(),
  ]);

  const services = sermons.filter((s) => s.category === "service");
  const latestSermon = sermons.find((s) => s.category !== "service") ?? sermons[0];

  return (
    <>
      <Hero />
      <WelcomeToVobi />
      <UpcomingEvents events={events} />
      <StatementOfFaith />
      <TheMinistry />
      <WatchVobi services={services} />
      <Word latest={latestSermon} total={sermons.length} />
      <Leadership />
      <Testimonies testimonies={testimonies} />
      <NeedPrayer />
      <VisitSection />
    </>
  );
}
