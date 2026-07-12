import { describe, expect, it } from "vitest";
import { chatLeadSchema } from "./chat-lead-schema";

const valid = {
  name: "Ada Lovelace",
  company: "Analytical",
  email: "ada@example.com",
  phone: "",
  message: "We need help mapping a workflow automation opportunity.",
  preferredContact: "email",
  transcript: [{ role: "assistant", text: "How can I help?" }],
  consent: "yes",
  website: "",
  startedAt: Date.now() - 5000,
};

describe("chatLeadSchema", () => {
  it("accepts a lead with email", () => {
    expect(chatLeadSchema.safeParse(valid).success).toBe(true);
  });

  it("accepts a lead with phone instead of email", () => {
    expect(
      chatLeadSchema.safeParse({
        ...valid,
        email: "",
        phone: "+44 7700 900123",
      }).success,
    ).toBe(true);
  });

  it("requires at least one contact method", () => {
    expect(
      chatLeadSchema.safeParse({ ...valid, email: "", phone: "" }).success,
    ).toBe(false);
  });

  it("rejects honeypot content", () => {
    expect(chatLeadSchema.safeParse({ ...valid, website: "bot" }).success).toBe(
      false,
    );
  });
});
