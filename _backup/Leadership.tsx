import Link from "next/link";
import Image from "next/image";

import { thumb } from "@/lib/media";

export function Leadership() {
  return (
    <section className="border-b border-line bg-paper py-20 md:py-28">
      <div className="shell grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="reveal lg:col-span-5">
          <div className="frame aspect-video">
            <Image
              src={thumb("GiScarDvZec")}
              alt="Prophet Promise ministering in a VOBI Sunday service"
              width={1280}
              height={720}
              sizes="(max-width: 1024px) 100vw, 42vw"
              className="object-cover"
            />
          </div>
        </div>

        <div className="reveal lg:col-span-7">
          <p className="eyebrow text-gold">Leadership</p>
          <h2 className="display-md mt-6">Prophet Promise</h2>
          <p className="mt-4 text-[14px] font-medium text-muted">
            Lead minister, Valley of Blessings International Ministries
          </p>

          <div className="mt-8 space-y-6 text-[15px] leading-relaxed text-muted md:text-base">
            <p className="border-l-2 border-gold pl-5 font-display text-[1.35rem] leading-[1.3] tracking-[-0.02em] text-ink">
              &ldquo;Viewers around the globe, welcome to the Sunday service in the presence
              of God Almighty in VOBI Ministries with the man of God Prophet Promise.&rdquo;
            </p>
            <p>
              That is how the ministry introduces its own Sunday broadcasts — in its own
              words, on its own channel. Every sermon, service and prayer published by VOBI is
              ministered by Prophet Promise, including recent messages such as{" "}
              <span className="text-ink">Power In The Mouth</span> and{" "}
              <span className="text-ink">If God has said it no one can stop it</span>.
            </p>
            <p>
              A ministry-approved portrait, a full biography and the story of his calling have
              not been released publicly. This site carries them exactly as VOBI supplies
              them.
            </p>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/about/leadership" className="btn btn-ink">
              Read more
            </Link>
            <Link href="/sermons" className="btn btn-ghost text-ink">
              His messages
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
