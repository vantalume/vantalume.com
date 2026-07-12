import { z } from "zod";

export const chatLeadSchema = z
  .object({
    name: z.string().trim().min(2).max(100),
    company: z.string().trim().max(150).optional().default(""),
    email: z.union([z.literal(""), z.string().trim().email().max(254)]),
    phone: z.string().trim().max(40).optional().default(""),
    message: z.string().trim().min(10).max(2000),
    preferredContact: z.enum(["email", "phone", "whatsapp", "either"]),
    transcript: z
      .array(
        z.object({
          role: z.enum(["visitor", "assistant"]),
          text: z.string().trim().min(1).max(1000),
        }),
      )
      .min(1)
      .max(30),
    consent: z.literal("yes"),
    website: z.string().max(0).optional().default(""),
    startedAt: z.coerce.number(),
  })
  .refine((value) => value.email || value.phone, {
    message: "Enter an email address or phone number so we can respond.",
    path: ["email"],
  });

export type ChatLeadInput = z.infer<typeof chatLeadSchema>;
