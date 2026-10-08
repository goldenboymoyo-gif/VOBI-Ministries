import { site } from "@/config/site";

const API = process.env.VOBI_API_URL;

export type InquiryKind = "contact" | "prayer";

export interface InquiryInput {
  name?: string;
  contact?: string;
  subject?: string;
  message?: string;
  request?: string;
  consent?: string;
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validate(
  kind: InquiryKind,
  input: InquiryInput,
): { ok: true; payload: Record<string, string> } | { ok: false; error: string } {
  const name = (input.name ?? "").trim();
  const contact = (input.contact ?? "").trim();
  const subject = (input.subject ?? "").trim();
  const body = (input.message ?? input.request ?? "").trim();

  if (input.consent !== "yes") {
    return { ok: false, error: "Please confirm the checkbox before sending." };
  }
  if (kind === "contact" && !name) return { ok: false, error: "Please tell us your name." };
  if (kind === "contact" && !contact) {
    return { ok: false, error: "Please leave an email address or phone number so we can reply." };
  }
  if (kind === "contact" && contact.includes("@") && !EMAIL.test(contact)) {
    return { ok: false, error: "That email address does not look complete." };
  }
  if (!body) {
    return {
      ok: false,
      error: kind === "prayer" ? "Please write your prayer request." : "Please write a message.",
    };
  }
  if (body.length < 10) {
    return { ok: false, error: "Please write a little more so the ministry can help." };
  }
  if (body.length > 5000) return { ok: false, error: "That is too long — please shorten it." };

  return {
    ok: true,
    payload: {
      kind,
      name,
      contact,
      subject,
      message: body,
      consent: "yes",
      source: "vobi-website",
      submittedAt: new Date().toISOString(),
      page: kind === "prayer" ? "/prayer" : "/contact",
      church: site.fullName,
    },
  };
}

export async function forward(
  kind: InquiryKind,
  payload: Record<string, string>,
): Promise<{ status: number; body: unknown }> {
  if (!API) return sendByEmail(kind, payload);
  try {
    const res = await fetch(`${API}/api/${kind === "prayer" ? "prayer-requests" : "contacts"}`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(8000),
    });
    const text = await res.text();
    return { status: res.status, body: text ? safeJson(text) : null };
  } catch {
    return {
      status: 503,
      body: {
        error: "The message service is temporarily unavailable. Please call the church instead.",
      },
    };
  }
}

function safeJson(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    return { raw: text };
  }
}

/** No backend configured: deliver the message to the ministry's inbox through FormSubmit. */
async function sendByEmail(
  kind: InquiryKind,
  payload: Record<string, string>,
): Promise<{ status: number; body: unknown }> {
  try {
    const res = await fetch(`https://formsubmit.co/ajax/${site.email}`, {
      method: "POST",
      headers: { "content-type": "application/json", accept: "application/json" },
      body: JSON.stringify({
        _subject: kind === "prayer" ? "VOBI website: prayer request" : "VOBI website: message",
        _template: "table",
        _captcha: "false",
        name: payload.name || "Not given",
        contact: payload.contact || "Not given",
        subject: payload.subject || "-",
        message: payload.message,
      }),
      signal: AbortSignal.timeout(10000),
    });
    const data = (await res.json().catch(() => null)) as { success?: string } | null;
    if (res.ok && String(data?.success) === "true") return { status: 200, body: { ok: true } };
  } catch {}
  return { status: 503, body: { error: "We could not send that just now. Please call the church instead." } };
}
