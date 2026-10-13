import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { can } from "../src/lib/roles";

describe("role permissions", () => {
  it("keeps user administration exclusive to super administrators", () => {
    assert.equal(can("SUPER_ADMIN", "users:manage"), true);
    assert.equal(can("ADMIN", "users:manage"), false);
    assert.equal(can("EDITOR", "users:manage"), false);
  });

  it("allows editors to manage content but not inquiries", () => {
    assert.equal(can("EDITOR", "content:write"), true);
    assert.equal(can("EDITOR", "inquiries:read"), false);
    assert.equal(can("ADMIN", "inquiries:write"), true);
  });

  it("limits service catalogue administration to administrators", () => {
    assert.equal(can("SUPER_ADMIN", "services:write"), true);
    assert.equal(can("ADMIN", "services:write"), true);
    assert.equal(can("EDITOR", "services:write"), false);
  });
});
