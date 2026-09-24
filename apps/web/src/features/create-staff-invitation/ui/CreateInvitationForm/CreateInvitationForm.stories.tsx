import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, userEvent, within } from "storybook/test";
import { CreateInvitationForm } from "./CreateInvitationForm";

const meta = {
  title: "Панель управления/Сотрудники/Приглашение",
  component: CreateInvitationForm,
  args: {
    availableRoles: [
      { value: "manager", label: "Менеджер" },
      { value: "editor", label: "Редактор" },
    ],
    onCreate: async () => ({
      url: "https://perviyzakaz.ru/admin/invite/storybook-only-token",
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    }),
  },
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Доступные роли должен вернуть API. Создание ссылки и срок действия подтверждает сервер; здесь показан только интерфейс и демонстрационный результат.",
      },
    },
  },
} satisfies Meta<typeof CreateInvitationForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { name: "Создание" };
export const RestrictedRoles: Story = {
  name: "Ограниченный выбор ролей",
  args: { availableRoles: [{ value: "manager", label: "Менеджер" }] },
};
export const ValidationError: Story = {
  name: "Ошибка валидации",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(
      canvas.getByRole("button", { name: "Создать ссылку" }),
    );
    await expect(
      canvas.getByText("Выберите роль из доступного списка."),
    ).toBeVisible();
  },
};
export const Success: Story = {
  name: "Приглашение создано",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const page = within(canvasElement.ownerDocument.body);
    await userEvent.click(
      canvas.getByRole("textbox", { name: "Роль нового сотрудника" }),
    );
    await userEvent.click(page.getByRole("option", { name: "Менеджер" }));
    await userEvent.click(
      canvas.getByRole("button", { name: "Создать ссылку" }),
    );
    await expect(await canvas.findByText("Приглашение создано")).toBeVisible();
  },
};
export const Mobile: Story = {
  name: "Телефон",
  parameters: { viewport: { defaultViewport: "mobile1" } },
};
