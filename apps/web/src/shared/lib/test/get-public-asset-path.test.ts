import { describe, expect, it } from "vitest";
import { getPublicAssetPath } from "../get-public-asset-path";

describe("getPublicAssetPath", () => {
  it("returns a root-relative path when no base path is configured", () => {
    expect(getPublicAssetPath("/logo.svg", "")).toBe("/logo.svg");
  });

  it("prefixes an asset with the configured deployment path", () => {
    expect(getPublicAssetPath("/logo.svg", "/1zakaz/")).toBe(
      "/1zakaz/logo.svg",
    );
  });
});
