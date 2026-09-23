import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { createDemoCalculation } from "../../lib/stories/create-demo-calculation";
import {
  DEMO_EXPENSES,
  DEMO_RATES,
  DEMO_RULE_SET,
} from "../../model/pricing-demo";
import { PricingCalculator } from "./PricingCalculator";

const meta = {
  title: "Панель управления/Цены и калькуляторы/Калькулятор",
  component: PricingCalculator,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Форма будущего расчёта через API: покупка, характеристики силовой установки, условия ввоза, город и подробная предварительная смета. В Storybook расчёт выполняется локально по демонстрационной редакции правил.",
      },
    },
  },
} satisfies Meta<typeof PricingCalculator>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {
  name: "Предварительная смета",
  args: {
    onCalculate: (request) =>
      createDemoCalculation(request, DEMO_RATES, DEMO_EXPENSES, DEMO_RULE_SET),
  },
};
export const ServerError: Story = {
  name: "Ошибка сервера",
  args: {
    onCalculate: async () => {
      throw new Error("unavailable");
    },
  },
};
