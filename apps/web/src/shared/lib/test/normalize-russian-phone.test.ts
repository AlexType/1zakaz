import { expect, it } from "vitest";
import { normalizeRussianPhone } from "../normalize-russian-phone";

it("приводит допустимые российские номера к одному формату", () => {
  expect(normalizeRussianPhone("8 (999) 123-45-67")).toBe("+79991234567");
  expect(normalizeRussianPhone("+7 999 123-45-67")).toBe("+79991234567");
  expect(normalizeRussianPhone("12345")).toBeNull();
});
