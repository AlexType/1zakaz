import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { SiteManagementWorkspace } from "./SiteManagementWorkspace";

const meta = {
  title: "Панель управления/Сайт/Настройки",
  component: SiteManagementWorkspace,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Прототип управления структурированными страницами, общим меню, данными компании, юридическими документами и постоянными перенаправлениями. Изменения хранятся только в состоянии Storybook.",
      },
    },
  },
} satisfies Meta<typeof SiteManagementWorkspace>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = { name: "Основной вид" };
export const Company: Story = {
  name: "Компания",
  args: { initialTab: "company" },
};
export const Forms: Story = {
  name: "Формы",
  args: { initialTab: "forms" },
};
export const Loading: Story = {
  name: "Загрузка",
  args: { loading: true },
};
export const LoadError: Story = {
  name: "Ошибка загрузки",
  args: { error: "Проверьте соединение и попробуйте ещё раз." },
};
export const Mobile: Story = {
  name: "Телефон",
  parameters: { viewport: { defaultViewport: "mobile1" } },
};
