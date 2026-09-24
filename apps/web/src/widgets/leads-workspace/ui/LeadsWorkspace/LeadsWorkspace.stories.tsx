import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { LeadsWorkspace } from "./LeadsWorkspace";

const meta = {
  title: "Панель управления/Заявки/Список",
  component: LeadsWorkspace,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Рабочая очередь заявок с общей панелью фильтров, сортировкой, пагинацией, настройкой колонок и быстрым открытием карточки по клику на строку.",
      },
    },
  },
} satisfies Meta<typeof LeadsWorkspace>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = { name: "Основной вид" };

export const Overdue: Story = {
  name: "Просроченные",
  args: {
    initialFilters: { overdueOnly: true },
  },
};

export const WithOpenDrawer: Story = {
  name: "С открытой карточкой",
  args: {
    initialSelectedLeadId: "L-1042",
  },
};

export const Mobile: Story = {
  name: "Мобильный экран",
  parameters: {
    viewport: { defaultViewport: "mobile1" },
  },
};
