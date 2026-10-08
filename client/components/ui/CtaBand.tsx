import Link from "next/link";

export function CtaBand({ title, text, href, label }: { title: string; text: string; href: string; label: string }) {
  return (
    <section className="bg-gold-bright text-ink">
      <div className="shell flex flex-col items-start justify-between gap-6 py-14 md:flex-row md:items-center">
        <div className="reveal max-w-2xl">
          <h2 className="display-md">{title}</h2>
          <p className="mt-3 text-lg">{text}</p>
        </div>
        <Link href={href} className="btn btn-ink reveal shrink-0">{label}</Link>
      </div>
    </section>
  );
}
