import { expect, it } from "vitest";
import {
  formatPersonShortName,
  getPersonInitials,
} from "../format-person-short-name";

it("сокращает ФИО для таблицы и аватара", () => {
  expect(formatPersonShortName("Петрова Анна Сергеевна")).toBe("Петрова А.С.");
  expect(getPersonInitials("Петрова Анна Сергеевна")).toBe("ПА");
});
