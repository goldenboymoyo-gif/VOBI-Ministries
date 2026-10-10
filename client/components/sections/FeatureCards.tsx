import Link from "next/link";
import Image from "next/image";


const cards = [
  {
    img: "/photos/congregation.jpg",
    title: "What We Believe",
    text: "Because of Christ we are saved. This is the foundation of everything we teach and everything we do.",
    href: "/about/what-we-believe",
  },
  {
    img: "/photos/praise.jpg",
    title: "VOBI Ministries",
    text: "A church in Mkhosana, Victoria Falls, under Prophet Promise, healing, deliverance, prayer and the Word every week.",
    href: "/about/story",
  },
  {
    img: "/photos/worship.jpg",
    title: "VOBI TV",
    text: "Sunday services, sermons and testimonies from our own channel, free to watch anywhere in the world.",
    href: "/sermons",
  },
];

export function FeatureCards() {
  return (
    <section className="bg-paper py-16 text-ink md:py-24">
      <div className="shell grid gap-6 md:grid-cols-3">
        {cards.map((c) => (
          <Link key={c.title} href={c.href} className="group block bg-white shadow-md">
            <div className="frame aspect-video overflow-hidden">
              <Image
                src={c.img}
                alt={`${c.title} at VOBI`}
                width={1280}
                height={720}
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
            <div className="p-6">
              <h3 className="font-display text-2xl font-semibold">{c.title}</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-muted">{c.text}</p>
              <span className="mt-5 inline-block text-xs font-semibold uppercase tracking-[0.18em] text-gold">
                Learn more
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
