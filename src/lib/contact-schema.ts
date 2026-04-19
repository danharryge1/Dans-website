import { z } from "zod";
import { contactCopy } from "@/components/sections/Contact/contact.data";

export const contactInputSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, contactCopy.errors.nameRequired)
    .max(80, contactCopy.errors.tooLong),
  email: z
    .string()
    .trim()
    .min(1, contactCopy.errors.emailInvalid)
    .max(120, contactCopy.errors.emailInvalid)
    .email(contactCopy.errors.emailInvalid),
  message: z
    .string()
    .trim()
    .min(15, contactCopy.errors.messageTooShort)
    .max(2000, contactCopy.errors.tooLong),
  website: z.string().max(0).optional(),
});

export type ContactInput = z.infer<typeof contactInputSchema>;

export function formatFieldErrors(
  error: z.ZodError,
): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path[0];
    if (typeof key === "string" && out[key] === undefined) {
      out[key] = issue.message;
    }
  }
  return out;
}
