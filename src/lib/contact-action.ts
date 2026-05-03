"use server";

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

const RECIPIENT = "dannyhgeorge@gmail.com";
const FROM_ADDRESS = "Contact Form <onboarding@resend.dev>";

export async function submitContact(
  _prevState: ContactState,
  formData: FormData,
): Promise<ContactState> {
  const payload = {
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
    message: String(formData.get("message") ?? ""),
    website: String(formData.get("website") ?? ""),
  };

  if (payload.website.length > 0) {
    return { status: "success" };
  }

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
      from: FROM_ADDRESS,
      to: RECIPIENT,
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
