import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import { HomePage } from "./HomePage";

test("главная показывает название компании", () => {
  render(<HomePage />);
  expect(
    screen.getByRole("heading", { level: 1, name: "Первый Заказ" }),
  ).toBeInTheDocument();
});
