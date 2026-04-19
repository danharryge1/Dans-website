"use server";

export type ContactState =
  | { status: "idle" }
  | { status: "error"; errors: Record<string, string> }
  | { status: "networkError" }
  | { status: "success" };

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

  try {
    const origin =
      process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
    const res = await fetch(`${origin}/api/contact`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
      cache: "no-store",
    });
    const body = (await res.json()) as
      | { ok: true }
      | { ok: false; errors?: Record<string, string> };
    if (res.ok && body.ok) {
      return { status: "success" };
    }
    if (!body.ok && body.errors && Object.keys(body.errors).length > 0) {
      return { status: "error", errors: body.errors };
    }
    return { status: "networkError" };
  } catch {
    return { status: "networkError" };
  }
}
