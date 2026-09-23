import { expect, it } from "vitest";
import { isValidSiteUrl } from "../is-valid-site-url";

it("принимает внутренние и безопасные внешние ссылки", () => {
  expect(isValidSiteUrl("/cars")).toBe(true);
  expect(isValidSiteUrl("https://t.me/perviyzakaz")).toBe(true);
});

it("отклоняет пустые, относительные и небезопасные ссылки", () => {
  expect(isValidSiteUrl("")).toBe(false);
  expect(isValidSiteUrl("cars")).toBe(false);
  expect(isValidSiteUrl("javascript:alert(1)")).toBe(false);
  expect(isValidSiteUrl("http://example.ru")).toBe(false);
});
