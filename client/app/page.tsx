import { Hero } from "@/components/sections/Hero";
import { SundayService } from "@/components/sections/SundayService";
import { AboutIntro } from "@/components/sections/AboutIntro";
import { StoryStrip } from "@/components/sections/StoryStrip";
import { Word } from "@/components/sections/Word";
import { WorshipLife } from "@/components/sections/WorshipLife";
import { MinistriesStrip } from "@/components/sections/MinistriesStrip";
import { EventsSection } from "@/components/sections/EventsSection";
import { PrayerCTA } from "@/components/sections/PrayerCTA";
import { Testimonies } from "@/components/sections/Testimonies";
import { VisitSection } from "@/components/sections/VisitSection";

import { getEvents, getMinistries, getSermons, getTestimonies } from "@/lib/data";

export default async function HomePage() {
  const [sermons, ministries, events, testimonies] = await Promise.all([
    getSermons(),
    getMinistries(),
    getEvents(),
    getTestimonies(),
  ]);

  const services = sermons.filter((s) => s.category === "service");
  const latestService = services[0];
  const latestSermon = sermons.find((s) => s.category !== "service") ?? sermons[0];

  return (
    <>
      <Hero
        latestDate={
          latestService
            ? new Date(`${latestService.date}T12:00:00Z`).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "long",
                year: "numeric",
                timeZone: "UTC",
              })
            : "Soon"
        }
      />
      <SundayService service={latestService} />
      <AboutIntro />
      <StoryStrip />
      <Word latest={latestSermon} total={sermons.length} />
      <WorshipLife />
      <MinistriesStrip ministries={ministries} />
      <EventsSection events={events} />
      <PrayerCTA />
      <Testimonies testimonies={testimonies} />
      <VisitSection />
    </>
  );
}
