import { MantineProvider } from "@mantine/core";
import { fireEvent, render, screen } from "@testing-library/react";
import { expect, it, vi } from "vitest";
import { CodeForm } from "./CodeForm";

it("переводит фокус между ячейками и принимает код целиком из буфера", () => {
  const onVerify = vi.fn();

  render(
    <MantineProvider>
      <CodeForm
        destination="manager@example.ru"
        purpose="email"
        resendAfterSeconds={0}
        busy={false}
        error={null}
        onVerify={onVerify}
      />
    </MantineProvider>,
  );

  const first = screen.getByRole("textbox", {
    name: "Код из письма, цифра 1 из 6",
  });
  const second = screen.getByRole("textbox", {
    name: "Код из письма, цифра 2 из 6",
  });
  const last = screen.getByRole("textbox", {
    name: "Код из письма, цифра 6 из 6",
  });

  fireEvent.change(first, { target: { value: "1" } });
  expect(second).toHaveFocus();
  fireEvent.keyDown(second, { key: "Backspace" });
  expect(first).toHaveFocus();

  fireEvent.paste(first, {
    clipboardData: { getData: () => "123456" },
  });
  expect(last).toHaveFocus();
  expect(first).toHaveValue("1");
  expect(last).toHaveValue("6");

  fireEvent.click(screen.getByRole("button", { name: "Подтвердить" }));
  expect(onVerify).toHaveBeenCalledWith("123456");
});
