import { expect, it } from "vitest";
import {
  formatCompactDate,
  formatCompactDateTime,
} from "../format-compact-date";

it("выводит дату и время в коротком формате", () => {
  const value = new Date(2026, 8, 22, 15, 20).toISOString();
  expect(formatCompactDate(value)).toBe("22.09.2026");
  expect(formatCompactDateTime(value)).toBe("22.09.2026, 15:20");
});
