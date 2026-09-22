import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { CreateInvitationForm } from "./CreateInvitationForm";

const meta = {
  title: "Панель управления/Доступ сотрудников/Создание приглашения",
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

export const Default: Story = { name: "Создать ссылку" };
export const RestrictedRoles: Story = {
  name: "Ограниченный выбор ролей",
  args: { availableRoles: [{ value: "manager", label: "Менеджер" }] },
};
