import { describe, expect, it } from "vitest";
import { slugifyArticleTitle } from "../stories/slugify-article-title";

describe("slugifyArticleTitle", () => {
  it("transliterates a Russian heading into a URL segment", () => {
    expect(slugifyArticleTitle("Как купить авто из Японии?")).toBe(
      "kak-kupit-avto-iz-yaponii",
    );
  });
});
