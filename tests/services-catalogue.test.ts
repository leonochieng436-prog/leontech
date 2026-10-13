import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { SERVICE_CATEGORIES, buildServiceSeedContent, services } from "../src/lib/content";

describe("service catalogue seed", () => {
  it("provides records for all required service categories", () => {
    const categories = new Set(services.map((service) => buildServiceSeedContent(service).category));
    assert.deepEqual([...categories].sort(), [...SERVICE_CATEGORIES].sort());
  });

  it("seeds complete quote-first service content without invented prices", () => {
    for (const service of services) {
      const content = buildServiceSeedContent(service);
      assert.ok(content.businessProblems.length, `${service.slug} should list problems solved`);
      assert.ok(content.deliverables.length, `${service.slug} should list deliverables`);
      assert.ok(content.technologies.length, `${service.slug} should list technology options`);
      assert.ok(content.benefits.length, `${service.slug} should list benefits`);
      assert.ok(content.useCases.length, `${service.slug} should list use cases`);
      assert.ok(content.faqs.length, `${service.slug} should list FAQs`);
      assert.equal(new Set(content.faqs.map((faq) => faq.question)).size, content.faqs.length);
    }
  });
});
