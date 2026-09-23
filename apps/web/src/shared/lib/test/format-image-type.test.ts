import { expect, it } from "vitest";
import { formatImageType } from "../format-image-type";

it("подписывает формат по MIME и использует расширение при его отсутствии", () => {
  expect(formatImageType("photo.jpeg", "image/jpeg")).toBe("JPG");
  expect(formatImageType("car.webp", "")).toBe("WEBP");
  expect(formatImageType("car.svg", "image/svg+xml")).toBe("SVG");
});
