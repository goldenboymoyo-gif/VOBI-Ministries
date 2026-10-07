"use client";

import { useState, type FormEvent } from "react";

type Variant = "contact" | "prayer";

type Props = {
  variant: Variant;
  className?: string;
};

type Status = "idle" | "submitting" | "sent" | "error";

export function MessageForm({ variant, className = "" }: Props) {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  const isPrayer = variant === "prayer";

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    setStatus("submitting");
    setError(null);

    try {
      const res = await fetch(`/api/${variant}`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const body = (await res.json().catch(() => null)) as { error?: string } | null;
        throw new Error(body?.error ?? "Something went wrong. Please try again.");
      }

      setStatus("sent");
      form.reset();
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  if (status === "sent") {
    return (
      <div className={`border border-line bg-paper-dim px-7 py-12 ${className}`} role="status">
        <p className="display-sm">
          {isPrayer ? "Your request has been received." : "Thank you — your message has been sent."}
        </p>
        <p className="mt-4 max-w-md text-[15px] leading-relaxed text-muted">
          {isPrayer
            ? "It is held privately by the ministry and is never published, listed or shared."
            : "The ministry will reply on the details you gave. If it is urgent, you can call the church on the number listed below."}
        </p>
        <button
          type="button"
          className="btn btn-ghost mt-8 text-ink"
          onClick={() => setStatus("idle")}
        >
          {isPrayer ? "Send another request" : "Write another message"}
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className={`space-y-7 ${className}`} noValidate>
      <div className="grid gap-7 sm:grid-cols-2">
        <label className="block">
          <span className="eyebrow text-muted-light">
            {isPrayer ? "Your name (optional)" : "Your name"}
          </span>
          <input name="name" type="text" autoComplete="name" className="field mt-2" required={!isPrayer} />
        </label>

        <label className="block">
          <span className="eyebrow text-muted-light">
            {isPrayer ? "Email or phone (optional)" : "Email"}
          </span>
          <input
            name="contact"
            type="text"
            autoComplete="email"
            className="field mt-2"
            required={!isPrayer}
          />
        </label>
      </div>

      {!isPrayer && (
        <label className="block">
          <span className="eyebrow text-muted-light">Subject</span>
          <input name="subject" type="text" className="field mt-2" />
        </label>
      )}

      <label className="block">
        <span className="eyebrow text-muted-light">{isPrayer ? "Your request" : "Message"}</span>
        <textarea
          name={isPrayer ? "request" : "message"}
          rows={6}
          className="field mt-2 resize-y"
          required
        />
      </label>

      <label className="flex items-start gap-3 text-[13px] leading-relaxed text-muted">
        <input
          type="checkbox"
          name="consent"
          value="yes"
          required
          className="mt-1 h-4 w-4 accent-[#7d5f12]"
        />
        <span>
          {isPrayer
            ? "I understand this request is sent to the ministry privately and will not be published anywhere."
            : "I agree that the ministry may reply to me using the details above."}
        </span>
      </label>

      {status === "error" && (
        <p className="border-l-2 border-gold pl-4 text-[14px] text-gold" role="alert">
          {error}
        </p>
      )}

      <button type="submit" className="btn btn-ink" disabled={status === "submitting"}>
        {status === "submitting"
          ? "Sending…"
          : isPrayer
            ? "Send prayer request"
            : "Send message"}
      </button>
    </form>
  );
}
