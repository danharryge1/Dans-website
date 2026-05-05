"use server";

import { headers } from "next/headers";
import { Resend } from "resend";
import {
  contactInputSchema,
  formatFieldErrors,
} from "@/lib/contact-schema";

export type ContactState =
  | { status: "idle" }
  | { status: "error"; errors: Record<string, string> }
  | { status: "networkError" }
  | { status: "success" };

const RECIPIENT    = "dan@dangeorge.studio";
const FROM_ADDRESS = "Contact Form <onboarding@resend.dev>";

// ── In-process rate limiter ────────────────────────────────────────────────
// Serverless instances don't share memory, so this limits per-instance burst
// rather than global traffic — good enough for a personal portfolio form.
const ipLog = new Map<string, number[]>();
const RATE_LIMIT   = 3;        // max submissions per window
const RATE_WINDOW  = 600_000;  // 10 minutes in ms

function isRateLimited(ip: string): boolean {
  const now  = Date.now();
  const hits = (ipLog.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW);
  if (hits.length >= RATE_LIMIT) return true;
  hits.push(now);
  ipLog.set(ip, hits);
  return false;
}

// ── Timing check ──────────────────────────────────────────────────────────
// Genuine users take at least a second to fill the multi-step form.
// Bots that POST immediately are silently dropped.
const MIN_FILL_MS = 1_500;

export async function submitContact(
  _prevState: ContactState,
  formData: FormData,
): Promise<ContactState> {
  // Honeypot — bots fill hidden fields; real browsers leave them empty.
  if (String(formData.get("website") ?? "").length > 0) {
    return { status: "success" };
  }

  // Timing check — silent drop for suspiciously fast submissions.
  const formTime = Number(formData.get("_t") ?? "0");
  if (formTime > 0 && Date.now() - formTime < MIN_FILL_MS) {
    return { status: "success" };
  }

  // IP rate limit.
  const headersList = await headers();
  const ip =
    headersList.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    headersList.get("x-real-ip") ??
    "unknown";
  if (isRateLimited(ip)) {
    return { status: "networkError" };
  }

  const payload = {
    name:    String(formData.get("name")    ?? ""),
    email:   String(formData.get("email")   ?? ""),
    message: String(formData.get("message") ?? ""),
  };

  const parsed = contactInputSchema.safeParse(payload);
  if (!parsed.success) {
    return { status: "error", errors: formatFieldErrors(parsed.error) };
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("[contact] RESEND_API_KEY not set, skipping send");
    return { status: "success" };
  }

  try {
    const resend = new Resend(apiKey);
    const result = await resend.emails.send({
      from:    FROM_ADDRESS,
      to:      RECIPIENT,
      replyTo: parsed.data.email,
      subject: `New inquiry from ${parsed.data.name}`,
      text: [
        `From: ${parsed.data.name} <${parsed.data.email}>`,
        "",
        parsed.data.message,
      ].join("\n"),
    });
    if (result.error) {
      console.error("[contact] resend error", result.error);
      return { status: "networkError" };
    }
    return { status: "success" };
  } catch (err) {
    console.error("[contact] send threw", err);
    return { status: "networkError" };
  }
}
