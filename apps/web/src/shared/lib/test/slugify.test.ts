import { describe, expect, it } from "vitest";
import { slugify } from "../slugify";

describe("slugify", () => {
  it("transliterates Russian text into a URL segment", () => {
    expect(slugify("Как купить авто из Японии?")).toBe(
      "kak-kupit-avto-iz-yaponii",
    );
  });

  it("normalizes repeated separators", () => {
    expect(slugify("  Toyota — Land Cruiser  ")).toBe("toyota-land-cruiser");
  });
});
