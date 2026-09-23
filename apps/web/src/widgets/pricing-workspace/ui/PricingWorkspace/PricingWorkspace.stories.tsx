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
