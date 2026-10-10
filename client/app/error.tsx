"use client";

import Link from "next/link";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <section className="bg-ink text-paper">
      <div className="shell flex min-h-[60vh] flex-col justify-center py-24">
        <p className="eyebrow text-gold-bright">Something went wrong</p>
        <h1 className="mt-4 text-3xl font-extrabold uppercase md:text-5xl">We could not load this page.</h1>
        <p className="mt-5 max-w-lg text-paper/70">Please try again. If it keeps happening, contact the ministry.</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <button onClick={reset} className="btn btn-solid">Try again</button>
          <Link href="/" className="btn btn-ghost">Back to home</Link>
        </div>
      </div>
    </section>
  );
}
