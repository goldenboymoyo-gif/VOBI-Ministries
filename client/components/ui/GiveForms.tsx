"use client";

import { useRef, useState, type FormEvent } from "react";

type Way = "online" | "offering" | "bank" | "partner";

const WAYS: { id: Way; tag: string; t: string; d: string; cta: string }[] = [
  { id: "online", tag: "Give", t: "Give online", d: "Mobile money, card or online transfer from anywhere in the world.", cta: "Give online" },
  { id: "offering", tag: "Give", t: "One-time offering", d: "Sow a seed for a single need: the service, the broadcast, an outreach or a project.", cta: "Sow a seed" },
  { id: "bank", tag: "Give", t: "Bank transfer", d: "Pay straight from your bank, then tell us so we can confirm and thank you.", cta: "Bank transfer" },
  { id: "partner", tag: "Partner", t: "Become a partner", d: "Stand with VOBI regularly in prayer and giving as the Gospel reaches more people.", cta: "Partner with us" },
];

const PURPOSES = ["Tithe", "Offering", "Seed", "Outreach and charity", "The broadcast", "Building project", "Missions", "Other"];
const CURRENCIES = ["USD", "ZAR", "BWP", "ZMW", "GBP", "EUR", "ZWL", "Other"];
const PARTNER = ["Monthly partner (prayer and giving)", "Prayer partner", "Project partner", "Business or church partner"];

const input = "mt-1 w-full rounded-lg border border-line bg-white px-3 py-3 text-[15px] text-ink outline-none focus:border-gold";
const label = "block text-sm font-semibold text-ink";

export function GiveForms() {
  const [way, setWay] = useState<Way | null>(null);
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState("");
  const panel = useRef<HTMLDivElement>(null);

  const pick = (w: Way) => {
    setWay(w); setStatus("idle"); setError("");
    window.setTimeout(() => panel.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
  };

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!way) return;
    const form = e.currentTarget;
    const d = Object.fromEntries(new FormData(form).entries()) as Record<string, string>;
    const title = WAYS.find((x) => x.id === way)!.t;
    const lines = [
      `Type: ${title}`,
      d.purpose ? `Purpose: ${d.purpose}` : "",
      d.partnerType ? `Partnership: ${d.partnerType}` : "",
      d.amount ? `Amount: ${d.currency || ""} ${d.amount}` : "",
      d.paidOn ? `Date of transfer: ${d.paidOn}` : "",
      d.reference ? `Bank reference: ${d.reference}` : "",
      `Country: ${d.country || "-"}`,
      d.phone ? `Phone/WhatsApp: ${d.phone}` : "",
      d.note ? `Note: ${d.note}` : "",
    ].filter(Boolean);
    setStatus("sending"); setError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST", headers: { "content-type": "application/json" },
        body: JSON.stringify({ name: d.name, contact: d.email, subject: `${way === "partner" ? "Partnership" : "Giving"}: ${title}`, message: lines.join("\n"), consent: d.consent ? "yes" : "" }),
      });
      if (!res.ok) { const b = (await res.json().catch(() => null)) as { error?: string } | null; throw new Error(b?.error ?? "Something went wrong. Please try again."); }
      setStatus("sent"); form.reset();
    } catch (err) {
      setStatus("error"); setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  const giving = way && way !== "partner";

  return (
    <>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {WAYS.map((w) => (
          <article key={w.id} className={`flex flex-col rounded-2xl bg-white p-6 shadow-md ring-2 transition ${way === w.id ? "ring-gold-bright" : "ring-transparent"}`}>
            <p className="text-xs font-bold uppercase tracking-wider text-gold">{w.tag}</p>
            <h3 className="mt-2 text-lg font-bold">{w.t}</h3>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{w.d}</p>
            <button type="button" onClick={() => pick(w.id)} className="btn btn-gold mt-5 self-start">{w.cta}</button>
          </article>
        ))}
      </div>

      <div ref={panel} className="scroll-mt-24">
        {way && (
          <div className="mt-8 rounded-2xl bg-white p-6 shadow-md md:p-9">
            {status === "sent" ? (
              <div role="status" className="py-6 text-center">
                <h3 className="text-2xl font-extrabold">Thank you. God bless you.</h3>
                <p className="mx-auto mt-3 max-w-md text-muted">We have received your details and will contact you soon to confirm and share the next steps.</p>
                <button type="button" onClick={() => { setStatus("idle"); setWay(null); }} className="btn btn-ink mt-6">Done</button>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="grid gap-5 md:grid-cols-2">
                <div className="md:col-span-2">
                  <h3 className="text-xl font-extrabold uppercase">{WAYS.find((x) => x.id === way)!.t}</h3>
                  {way === "bank" && (
                    <p className="mt-2 rounded-lg bg-gold-bright/20 p-4 text-sm leading-relaxed text-ink">
                      <b>Bank account details:</b> they will be shown here very soon. Fill in this form now to tell us about your gift or to ask for the account details, and we will reply with everything you need.
                    </p>
                  )}
                  {way === "online" && <p className="mt-2 text-sm text-muted">Tell us how you would like to give and we will send the right payment option for your country.</p>}
                  {way === "partner" && <p className="mt-2 text-sm text-muted">Welcome. Tell us a little about you and how you want to partner.</p>}
                </div>

                <label className={label}>Full name *<input name="name" required maxLength={80} className={input} autoComplete="name" /></label>
                <label className={label}>Email *<input name="email" type="email" required maxLength={120} className={input} autoComplete="email" /></label>
                <label className={label}>Phone / WhatsApp<input name="phone" maxLength={30} className={input} autoComplete="tel" /></label>
                <label className={label}>Country *<input name="country" required maxLength={60} className={input} autoComplete="country-name" /></label>

                {giving && (
                  <>
                    <label className={label}>What is it for?
                      <select name="purpose" className={input} defaultValue="Offering">{PURPOSES.map((p) => <option key={p}>{p}</option>)}</select>
                    </label>
                    <div className="grid grid-cols-[110px_1fr] gap-3">
                      <label className={label}>Currency
                        <select name="currency" className={input} defaultValue="USD">{CURRENCIES.map((c) => <option key={c}>{c}</option>)}</select>
                      </label>
                      <label className={label}>Amount
                        <input name="amount" inputMode="decimal" maxLength={14} className={input} placeholder="0.00" />
                      </label>
                    </div>
                  </>
                )}
                {way === "bank" && (
                  <>
                    <label className={label}>Date of transfer (if already sent)<input name="paidOn" type="date" className={input} /></label>
                    <label className={label}>Bank reference or proof number<input name="reference" maxLength={60} className={input} /></label>
                  </>
                )}
                {way === "partner" && (
                  <>
                    <label className={label}>How would you like to partner?
                      <select name="partnerType" className={input}>{PARTNER.map((p) => <option key={p}>{p}</option>)}</select>
                    </label>
                    <div className="grid grid-cols-[110px_1fr] gap-3">
                      <label className={label}>Currency
                        <select name="currency" className={input} defaultValue="USD">{CURRENCIES.map((c) => <option key={c}>{c}</option>)}</select>
                      </label>
                      <label className={label}>Monthly amount (optional)
                        <input name="amount" inputMode="decimal" maxLength={14} className={input} placeholder="0.00" />
                      </label>
                    </div>
                  </>
                )}

                <label className={`${label} md:col-span-2`}>Note or prayer point (optional)
                  <textarea name="note" rows={3} maxLength={1000} className={input} />
                </label>
                <label className="flex items-start gap-3 text-sm text-muted md:col-span-2">
                  <input type="checkbox" name="consent" required className="mt-1 h-4 w-4" />
                  <span>I agree that VOBI Ministries may contact me about this. My details are kept private and never published.</span>
                </label>
                {status === "error" && <p role="alert" className="text-sm font-semibold text-red-700 md:col-span-2">{error}</p>}
                <div className="md:col-span-2">
                  <button type="submit" disabled={status === "sending"} className="btn btn-gold">{status === "sending" ? "Sending..." : way === "partner" ? "Send my partner request" : "Submit"}</button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </>
  );
}