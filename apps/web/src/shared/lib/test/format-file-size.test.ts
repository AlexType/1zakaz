import { expect, it } from "vitest";
import { formatFileSize } from "../format-file-size";

it("показывает размер загруженного изображения в читаемых единицах", () => {
  expect(formatFileSize(1_572_864)).toBe("1,5 МБ");
  expect(formatFileSize(204_800)).toBe("200 КБ");
});
