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
    verifyTotp: unused,
    signInWithPasskey: unused,
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

it("после входа по паролю запрашивает код из приложения", async () => {
  const signInWithPassword = vi.fn(async () => ({
    status: "totp-required" as const,
    challengeId: "totp-1",
  }));
  const verifyTotp = vi.fn(async () => {});
  const gateway = gatewayWith({ signInWithPassword, verifyTotp });

  render(
    <MantineProvider>
      <StaffAuthFlow gateway={gateway} />
    </MantineProvider>,
  );

  fireEvent.click(screen.getByRole("tab", { name: "Номер и пароль" }));
  fireEvent.change(screen.getByRole("textbox", { name: "Номер телефона" }), {
    target: { value: "8 999 123-45-67" },
  });
  fireEvent.change(screen.getByPlaceholderText("Введите пароль"), {
    target: { value: "secret" },
  });
  fireEvent.click(screen.getByRole("button", { name: "Войти" }));

  expect(
    await screen.findByRole("heading", { name: "Введите код из приложения" }),
  ).toBeInTheDocument();
  expect(signInWithPassword).toHaveBeenCalledWith("+79991234567", "secret");

  "123456".split("").forEach((digit, index) => {
    fireEvent.change(
      screen.getByRole("textbox", {
        name: `Код из приложения, цифра ${index + 1} из 6`,
      }),
      { target: { value: digit } },
    );
  });
  fireEvent.click(screen.getByRole("button", { name: "Подтвердить" }));
  await waitFor(() =>
    expect(verifyTotp).toHaveBeenCalledWith("totp-1", "123456"),
  );
  expect(
    await screen.findByRole("heading", { name: "Вы вошли" }),
  ).toBeInTheDocument();
});
