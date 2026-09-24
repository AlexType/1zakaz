import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { PricingWorkspace } from "./PricingWorkspace";

const meta = {
  title: "Панель управления/Цены и калькуляторы/Параметры",
  component: PricingWorkspace,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Интерактивный прототип управления курсами, тарифами, таблицами пошлин, утильсбором и доставкой. Проверочный калькулятор строит полную предварительную смету по демонстрационной редакции правил; изменения живут только в памяти Storybook.",
      },
    },
  },
} satisfies Meta<typeof PricingWorkspace>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = { name: "Основной вид" };
export const Rules: Story = {
  name: "Правила расчёта",
  args: { initialTab: "rules" },
};
export const Review: Story = {
  name: "Проверка изменений",
  args: { initialTab: "review" },
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
  args: { initialTab: "calculator" },
  parameters: { viewport: { defaultViewport: "mobile1" } },
};
