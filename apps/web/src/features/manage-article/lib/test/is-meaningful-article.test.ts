import { describe, expect, it } from "vitest";
import {
  hasMeaningfulArticleContent,
  isMeaningfulArticle,
} from "../is-meaningful-article";

describe("article autosave significance", () => {
  it("does not create a draft for an untouched empty article", () => {
    expect(
      isMeaningfulArticle({
        title: "",
        excerpt: "",
        content: [{ type: "paragraph", content: [] }],
        hasCover: false,
      }),
    ).toBe(false);
  });

  it("treats text and custom blocks as meaningful content", () => {
    expect(
      hasMeaningfulArticleContent([
        { type: "paragraph", content: [{ type: "text", text: "Текст" }] },
      ]),
    ).toBe(true);
    expect(hasMeaningfulArticleContent([{ type: "callout" }])).toBe(true);
  });
});
