import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { LeadsWorkspace } from "./LeadsWorkspace";

const meta = {
  title: "Панель управления/Заявки/Список",
  component: LeadsWorkspace,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof LeadsWorkspace>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = { name: "Основной вид" };
