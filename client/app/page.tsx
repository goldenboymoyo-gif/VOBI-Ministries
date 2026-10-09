import { FeatureCards } from "@/components/sections/FeatureCards";
import { BrandVideo } from "@/components/sections/BrandVideo";
import { FollowWatch } from "@/components/sections/FollowWatch";
import { EventCards } from "@/components/sections/EventCards";
import { Hero } from "@/components/sections/Hero";
import { Word } from "@/components/sections/Word";
import { Leadership } from "@/components/sections/Leadership";
import { Testimonies } from "@/components/sections/Testimonies";
import { CtaBand } from "@/components/ui/CtaBand";

import { getSermons, getTestimonies } from "@/lib/data";
import { getSettings } from "@/lib/settings";

export default async function HomePage() {
  const [sermons, testimonies, settings] = await Promise.all([
    getSermons(),
    getTestimonies(),
    getSettings(),
  ]);

  const services = sermons.filter((s) => s.category === "service");
  const latestSermon = sermons.find((s) => s.category !== "service") ?? sermons[0];

  return (
    <>
      <Hero video={settings.heroVideo || undefined} image={settings.heroImage || undefined} />
      {settings.announcement && <div className="gold-wash px-4 py-3 text-center text-sm font-bold text-ink md:text-base">{settings.announcement}</div>}
      <EventCards latest={services[0]} />
      <FeatureCards />
      <Word latest={latestSermon} total={sermons.length} />
      <Leadership />
      <Testimonies testimonies={testimonies} />
      <BrandVideo />
      <FollowWatch />
      <CtaBand title="Need prayer?" text="Send your request. It is read in private and never published." href="/prayer" label="Send a request" />
    </>
  );
}
