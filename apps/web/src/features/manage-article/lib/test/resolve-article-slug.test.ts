import { describe, expect, it } from "vitest";
import { resolveArticleSlug } from "../resolve-article-slug";

describe("resolveArticleSlug", () => {
  it("сохраняет заданный вручную адрес", () => {
    expect(resolveArticleSlug("special-offer", "Новости", ["novosti"])).toBe(
      "special-offer",
    );
  });

  it("создаёт уникальный адрес из заголовка", () => {
    expect(resolveArticleSlug("", "Новости", ["novosti", "novosti-2"])).toBe(
      "novosti-3",
    );
  });
});
