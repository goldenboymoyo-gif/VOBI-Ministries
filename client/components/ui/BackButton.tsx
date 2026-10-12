import Link from "next/link";

/** Always returns to the Home page. */
export function BackButton() {
  return (
    <Link href="/" className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-semibold text-white backdrop-blur hover:bg-white/25">
      <svg viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current" strokeWidth="2.5" aria-hidden><path d="M15 5l-7 7 7 7" /></svg>
      Back to Home
    </Link>
  );
}
