import { NextResponse } from "next/server";
import { Resend } from "resend";
import {
  contactInputSchema,
  formatFieldErrors,
} from "@/lib/contact-schema";

const RECIPIENT = "danharryge@gmail.com";
const FROM_ADDRESS = "Contact Form <onboarding@resend.dev>";

export async function POST(req: Request) {
  let rawBody: unknown;
  try {
    rawBody = await req.json();
  } catch {
    return NextResponse.json(
      { ok: false, errors: {} as Record<string, string> },
      { status: 400 },
    );
  }

  // Honeypot check runs BEFORE Zod validation so silent-drop behavior works
  // (the schema itself rejects any non-empty `website` value).
  if (
    rawBody &&
    typeof rawBody === "object" &&
    "website" in rawBody &&
    typeof (rawBody as { website?: unknown }).website === "string" &&
    ((rawBody as { website: string }).website).length > 0
  ) {
    return NextResponse.json({ ok: true }, { status: 200 });
  }

  const parsed = contactInputSchema.safeParse(rawBody);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, errors: formatFieldErrors(parsed.error) },
      { status: 400 },
    );
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ ok: true }, { status: 200 });
  }

  try {
    const resend = new Resend(apiKey);
    await resend.emails.send({
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
    return NextResponse.json({ ok: true }, { status: 200 });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
