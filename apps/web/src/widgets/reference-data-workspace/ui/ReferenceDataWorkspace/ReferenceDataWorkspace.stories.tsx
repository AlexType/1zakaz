import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ReferenceDataWorkspace } from "./ReferenceDataWorkspace";

const meta = {
  title: "Панель управления/Справочники/Список",
  component: ReferenceDataWorkspace,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof ReferenceDataWorkspace>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = { name: "Основной вид" };
