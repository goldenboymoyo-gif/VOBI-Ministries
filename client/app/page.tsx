import { Hero } from "@/components/sections/Hero";
import { AboutIntro } from "@/components/sections/AboutIntro";
import { AboutTheMinistry } from "@/components/sections/AboutTheMinistry";
import { LeadershipSpotlight } from "@/components/sections/LeadershipSpotlight";
import { Word } from "@/components/sections/Word";
import { SundayService } from "@/components/sections/SundayService";
import { PrayerCTA } from "@/components/sections/PrayerCTA";
import { Testimonies } from "@/components/sections/Testimonies";
import { MinistriesStrip } from "@/components/sections/MinistriesStrip";
import { EventsSection } from "@/components/sections/EventsSection";
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
      <AboutIntro />
      <AboutTheMinistry />
      <LeadershipSpotlight />
      <Word latest={latestSermon} total={sermons.length} />
      <SundayService service={latestService} />
      <PrayerCTA />
      <Testimonies testimonies={testimonies} />
      <MinistriesStrip ministries={ministries} />
      <EventsSection events={events} />
      <VisitSection />
    </>
  );
}