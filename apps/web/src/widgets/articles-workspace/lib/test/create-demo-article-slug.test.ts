import { describe, expect, it } from "vitest";
import { createDemoArticleSlug } from "../stories/create-demo-article-slug";

describe("createDemoArticleSlug", () => {
  it("keeps demo article addresses unique", () => {
    expect(createDemoArticleSlug("Новости", ["novosti", "novosti-2"])).toBe(
      "novosti-3",
    );
  });
});
