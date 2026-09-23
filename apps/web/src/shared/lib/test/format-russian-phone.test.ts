import { expect, it } from "vitest";
import { formatRussianPhone } from "../format-russian-phone";

it("форматирует российский номер для чтения", () => {
  expect(formatRussianPhone("+79991234567")).toBe("+7 (999) 123-45-67");
  expect(formatRussianPhone("8 999 123 45 67")).toBe("+7 (999) 123-45-67");
});
