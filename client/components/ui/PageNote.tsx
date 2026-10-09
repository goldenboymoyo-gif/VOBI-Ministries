export function PageNote({ text }: { text?: string }) {
  if (!text?.trim()) return null;
  return (
    <section className="gold-wash px-4 py-6">
      <div className="shell-narrow whitespace-pre-line text-center text-base font-semibold md:text-lg">{text}</div>
    </section>
  );
}
