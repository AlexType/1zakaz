import { describe, expect, it } from "vitest";
import { invitationSchema } from "../validation";

describe("данные сотрудника", () => {
  it("не принимает приглашение без имени, почты и телефона", () => {
    expect(
      invitationSchema.safeParse({ fullName: "А", email: "bad", phone: "123" })
        .success,
    ).toBe(false);
  });
});
