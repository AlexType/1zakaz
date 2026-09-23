import { MantineProvider } from "@mantine/core";
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import type { StaffAuthGateway } from "../../model/contracts";
import { StaffAuthFlow } from "./StaffAuthFlow";

afterEach(cleanup);

const unused = async (): Promise<never> => {
  throw new Error("Не используется в этом тесте");
};

function gatewayWith(overrides: Partial<StaffAuthGateway>): StaffAuthGateway {
  return {
    requestEmailCode: unused,
    resendEmailCode: unused,
    verifyEmailCode: unused,
    signInWithPassword: unused,
    acceptInvitation: unused,
    resendInvitationCode: unused,
    verifyInvitationEmail: unused,
    requestRecovery: unused,
    ...overrides,
  };
}

it("проверяет почту до запроса кода и проходит подтверждение через адаптер", async () => {
  const requestEmailCode = vi.fn(async (email: string) => ({
    id: "challenge-1",
    destination: email,
    resendAfterSeconds: 30,
  }));
  const verifyEmailCode = vi.fn(async () => {});
  const gateway = gatewayWith({ requestEmailCode, verifyEmailCode });

  render(
    <MantineProvider>
      <StaffAuthFlow gateway={gateway} />
    </MantineProvider>,
  );

  fireEvent.click(screen.getByRole("button", { name: "Получить код" }));
  expect(
    await screen.findByText("Укажите корректную почту"),
  ).toBeInTheDocument();
  expect(requestEmailCode).not.toHaveBeenCalled();

  fireEvent.change(screen.getByRole("textbox", { name: "Электронная почта" }), {
    target: { value: "manager@example.ru" },
  });
  fireEvent.click(screen.getByRole("button", { name: "Получить код" }));
  expect(
    await screen.findByRole("heading", { name: "Проверьте почту" }),
  ).toBeInTheDocument();
  expect(requestEmailCode).toHaveBeenCalledWith("manager@example.ru");

  "123456".split("").forEach((digit, index) => {
    fireEvent.change(
      screen.getByRole("textbox", {
        name: `Код из письма, цифра ${index + 1} из 6`,
      }),
      { target: { value: digit } },
    );
  });
  fireEvent.click(screen.getByRole("button", { name: "Подтвердить" }));
  await waitFor(() =>
    expect(verifyEmailCode).toHaveBeenCalledWith("challenge-1", "123456"),
  );
  expect(
    await screen.findByRole("heading", { name: "Вы вошли" }),
  ).toBeInTheDocument();
});

it("входит по почте и паролю", async () => {
  const signInWithPassword = vi.fn(async () => {});
  const gateway = gatewayWith({ signInWithPassword });

  render(
    <MantineProvider>
      <StaffAuthFlow gateway={gateway} />
    </MantineProvider>,
  );

  fireEvent.click(screen.getByRole("tab", { name: "Почта и пароль" }));
  fireEvent.change(screen.getByRole("textbox", { name: "Электронная почта" }), {
    target: { value: "manager@example.ru" },
  });
  fireEvent.change(screen.getByPlaceholderText("Введите пароль"), {
    target: { value: "secret" },
  });
  fireEvent.click(screen.getByRole("button", { name: "Войти" }));

  await waitFor(() =>
    expect(signInWithPassword).toHaveBeenCalledWith(
      "manager@example.ru",
      "secret",
    ),
  );
  expect(
    await screen.findByRole("heading", { name: "Вы вошли" }),
  ).toBeInTheDocument();
});
