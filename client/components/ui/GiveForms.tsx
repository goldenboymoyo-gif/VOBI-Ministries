"use client";

import { useRef, useState, type FormEvent } from "react";

type Way = "online" | "offering" | "bank" | "partner";

const WAYS: { id: Way; t: string; d: string }[] = [
  { id: "online", t: "Give online", d: "Mobile money, card or online transfer, from anywhere in the world." },
  { id: "offering", t: "One-time offering", d: "Sow a seed for a single need: the service, the broadcast, an outreach or a project." },
  { id: "bank", t: "Bank transfer", d: "Pay straight from your bank, then tell us so we can confirm and thank you." },
  { id: "partner", t: "Become a partner", d: "Stand with VOBI regularly in prayer and giving as the Gospel reaches more people." },
];

const PURPOSES = ["Tithe", "Offering", "Seed", "Outreach and charity", "The broadcast", "Building project", "Missions", "Other"];
const CURRENCIES = ["USD", "ZAR", "BWP", "ZMW", "GBP", "EUR", "ZWL", "Other"];
const PARTNER = ["Monthly partner (prayer and giving)", "Prayer partner", "Project partner", "Business or church partner"];

const eb = "eyebrow text-muted-light";

export function GiveForms() {
  const [way, setWay] = useState<Way | null>(null);
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState("");
  const rows = useRef<Record<string, HTMLLIElement | null>>({});

  const toggle = (w: Way) => {
    const open = way === w;
    setWay(open ? null : w); setStatus("idle"); setError("");
    if (!open) window.setTimeout(() => rows.current[w]?.scrollIntoView({ behavior: "smooth", block: "start" }), 60);
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

  return (
    <ul className="border-b border-line">
      {WAYS.map((w, i) => {
        const open = way === w.id;
        const giving = w.id !== "partner";
        return (
          <li key={w.id} ref={(el) => { rows.current[w.id] = el; }} className="scroll-mt-24 border-t border-line">
            <button type="button" onClick={() => toggle(w.id)} aria-expanded={open}
              className="grid w-full grid-cols-[2.5rem_1fr_auto] items-center gap-x-4 py-7 text-left md:grid-cols-[4.5rem_1fr_auto] md:py-9">
              <span className="font-display text-[1.4rem] text-gold md:text-[1.9rem]">{String(i + 1).padStart(2, "0")}</span>
              <span>
                <span className="display-sm block">{w.t}</span>
                <span className="mt-2 block max-w-xl text-[15px] leading-relaxed text-muted">{w.d}</span>
              </span>
              <span className="flex h-11 w-11 items-center justify-center rounded-full border border-ink text-xl leading-none text-ink transition-transform" style={{ transform: open ? "rotate(45deg)" : "none" }} aria-hidden="true">+</span>
            </button>

            {open && (
              <div className="pb-10 md:pl-[4.5rem]">
                {status === "sent" ? (
                  <div role="status" className="border-l-2 border-gold py-2 pl-5">
                    <p className="display-sm">Thank you. God bless you.</p>
                    <p className="mt-3 max-w-md text-[15px] leading-relaxed text-muted">We have received your details and will contact you soon to confirm and share the next steps.</p>
                    <button type="button" onClick={() => { setStatus("idle"); setWay(null); }} className="btn btn-ink mt-6">Close</button>
                  </div>
                ) : (
                  <form onSubmit={onSubmit} className="grid max-w-3xl gap-x-8 gap-y-7 sm:grid-cols-2">
                    {w.id === "bank" && (
                      <p className="border-l-2 border-gold pl-4 text-[15px] leading-relaxed text-ink sm:col-span-2">
                        Our bank account details will be published here soon. Fill in this form to tell us about your gift or to ask for the account details, and we will reply with everything you need.
                      </p>
                    )}
                    <label className="block"><span className={eb}>Full name *</span><input name="name" required maxLength={80} className="field mt-2" autoComplete="name" /></label>
                    <label className="block"><span className={eb}>Email *</span><input name="email" type="email" required maxLength={120} className="field mt-2" autoComplete="email" /></label>
                    <label className="block"><span className={eb}>Phone / WhatsApp</span><input name="phone" maxLength={30} className="field mt-2" autoComplete="tel" /></label>
                    <label className="block"><span className={eb}>Country *</span><input name="country" required maxLength={60} className="field mt-2" autoComplete="country-name" /></label>

                    {giving && (
                      <label className="block"><span className={eb}>What is it for?</span>
                        <select name="purpose" className="field mt-2" defaultValue="Offering">{PURPOSES.map((p) => <option key={p}>{p}</option>)}</select>
                      </label>
                    )}
                    {w.id === "partner" && (
                      <label className="block"><span className={eb}>How would you like to partner?</span>
                        <select name="partnerType" className="field mt-2">{PARTNER.map((p) => <option key={p}>{p}</option>)}</select>
                      </label>
                    )}
                    <div className="grid grid-cols-[6rem_1fr] gap-4">
                      <label className="block"><span className={eb}>Currency</span>
                        <select name="currency" className="field mt-2" defaultValue="USD">{CURRENCIES.map((c) => <option key={c}>{c}</option>)}</select>
                      </label>
                      <label className="block"><span className={eb}>{w.id === "partner" ? "Monthly amount (optional)" : "Amount"}</span>
                        <input name="amount" inputMode="decimal" maxLength={14} className="field mt-2" placeholder="0.00" />
                      </label>
                    </div>
                    {w.id === "bank" && (
                      <>
                        <label className="block"><span className={eb}>Date of transfer (if sent)</span><input name="paidOn" type="date" className="field mt-2" /></label>
                        <label className="block"><span className={eb}>Bank reference</span><input name="reference" maxLength={60} className="field mt-2" /></label>
                      </>
                    )}
                    <label className="block sm:col-span-2"><span className={eb}>Note or prayer point (optional)</span>
                      <textarea name="note" rows={3} maxLength={1000} className="field mt-2 resize-y" />
                    </label>
                    <label className="flex items-start gap-3 text-[13px] leading-relaxed text-muted sm:col-span-2">
                      <input type="checkbox" name="consent" required className="mt-1 h-4 w-4 accent-[#7d5f12]" />
                      <span>I agree that VOBI Ministries may contact me about this. My details are kept private and never published.</span>
                    </label>
                    {status === "error" && <p role="alert" className="border-l-2 border-gold pl-4 text-[14px] text-gold sm:col-span-2">{error}</p>}
                    <div className="sm:col-span-2">
                      <button type="submit" disabled={status === "sending"} className="btn btn-ink">{status === "sending" ? "Sending..." : w.id === "partner" ? "Send my partner request" : "Submit"}</button>
                    </div>
                  </form>
                )}
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}