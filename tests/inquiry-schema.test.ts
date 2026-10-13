import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { inquirySchema } from "../src/features/inquiries/schema";

const validInquiry = {
  fullName: "Alex Example",
  email: "alex@example.com",
  phone: "",
  company: "",
  service: "custom-software",
  budget: "Not sure yet",
  timeline: "",
  preferredContactMethod: "EMAIL",
  description: "We are looking for a better way to manage our daily operations.",
  consent: "yes",
  website: "",
};

describe("inquirySchema", () => {
  it("accepts a valid inquiry and trims free-text fields", () => {
    const result = inquirySchema.safeParse({ ...validInquiry, fullName: "  Alex Example  " });
    assert.equal(result.success, true);
    if (result.success) assert.equal(result.data.fullName, "Alex Example");
  });

  it("requires privacy consent", () => {
    assert.equal(inquirySchema.safeParse({ ...validInquiry, consent: undefined }).success, false);
  });

  it("rejects too-short project descriptions and invalid email addresses", () => {
    assert.equal(inquirySchema.safeParse({ ...validInquiry, description: "Too short" }).success, false);
    assert.equal(inquirySchema.safeParse({ ...validInquiry, email: "not-an-email" }).success, false);
  });

  it("rejects submissions that fill the spam honeypot", () => {
    assert.equal(inquirySchema.safeParse({ ...validInquiry, website: "spam" }).success, false);
  });
});
