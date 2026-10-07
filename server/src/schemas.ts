import { z } from "zod";

/**
 * Submission schemas for the two public forms on the VOBI website.
 *
 * Nothing here accepts, stores or returns anything that could be mistaken for
 * published ministry content — these are private messages only.
 */

const trimmed = (max: number) =>
  z
    .string()
    .transform((s) => s.trim())
    .pipe(z.string().min(1).max(max));

const consent = z
  .union([z.literal("yes"), z.literal(true), z.literal("on")])
  .refine((v) => v === true || v === "yes" || v === "on", {
    message: "Consent is required.",
  });

export const contactSchema = z
  .object({
    kind: z.literal("contact").optional(),
    name: trimmed(120),
    contact: trimmed(200),
    subject: z
      .string()
      .trim()
      .max(200)
      .optional()
      .default(""),
    message: trimmed(5000),
    consent,
    source: z.string().max(60).optional().default("vobi-website"),
    page: z.string().max(120).optional().default("/contact"),
    church: z.string().max(200).optional().default(""),
    submittedAt: z.string().max(40).optional(),
  })
  .strict();

export const prayerSchema = z
  .object({
    kind: z.literal("prayer").optional(),
    name: z
      .string()
      .trim()
      .max(120)
      .optional()
      .default(""),
    contact: z
      .string()
      .trim()
      .max(200)
      .optional()
      .default(""),
    subject: z
      .string()
      .trim()
      .max(200)
      .optional()
      .default(""),
    message: trimmed(5000),
    consent,
    source: z.string().max(60).optional().default("vobi-website"),
    page: z.string().max(120).optional().default("/prayer"),
    church: z.string().max(200).optional().default(""),
    submittedAt: z.string().max(40).optional(),
  })
  .strict();

export const emailLike = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function looksLikeEmail(value: string): boolean {
  return emailLike.test(value);
}

export type ContactInput = z.infer<typeof contactSchema>;
export type PrayerInput = z.infer<typeof prayerSchema>;
