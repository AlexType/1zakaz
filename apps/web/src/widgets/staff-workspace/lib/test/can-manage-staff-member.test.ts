import { describe, expect, it } from "vitest";
import { DEMO_STAFF } from "../stories/demo-staff";
import { canManageStaffMember } from "../can-manage-staff-member";

describe("canManageStaffMember", () => {
  it("protects the current account", () =>
    expect(canManageStaffMember(DEMO_STAFF[0], "1", 2)).toBe(false));
  it("protects the last active administrator", () =>
    expect(canManageStaffMember(DEMO_STAFF[0], "other", 1)).toBe(false));
  it("allows another employee to be managed", () =>
    expect(canManageStaffMember(DEMO_STAFF[1], "1", 1)).toBe(true));
});
