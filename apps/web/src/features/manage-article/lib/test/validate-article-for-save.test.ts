import { describe, expect, it } from "vitest";
import { validateArticleForSave } from "../validate-article-for-save";

const valid = {
  title: "Как выбрать автомобиль",
  excerpt: "Краткий гид",
  categoryId: "guides",
  hasBody: true,
  status: "published" as const,
};

describe("validateArticleForSave", () => {
  it("lets a partially filled article remain a draft", () =>
    expect(
      validateArticleForSave({
        ...valid,
        status: "draft",
        categoryId: null,
        excerpt: "",
        hasBody: false,
      }),
    ).toBeNull());
  it("requires editorial content for publication", () =>
    expect(validateArticleForSave({ ...valid, hasBody: false })).toMatch(
      /текст статьи/,
    ));
});
