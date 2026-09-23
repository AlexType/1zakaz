import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { AdminWorkspaceDemo } from "./AdminWorkspaceDemo";

const meta = {
  title: "Панель управления/Общее/Навигация",
  component: AdminWorkspaceDemo,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Интерактивная компоновка панели: компактная сворачиваемая навигация, профиль сотрудника в нижней части меню и глобальный поиск по разделам и рабочим записям через кнопку в шапке или ⌘/Ctrl + K. Автомобили, цены, статьи, сайт, сотрудники и профиль используют те же макеты, что и отдельные истории. Управление сайтом, ценами и сотрудниками доступно администратору; API и серверной сессии пока нет.",
      },
    },
  },
} satisfies Meta<typeof AdminWorkspaceDemo>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Administrator: Story = { name: "Администратор" };
export const Manager: Story = { name: "Менеджер", args: { role: "manager" } };
