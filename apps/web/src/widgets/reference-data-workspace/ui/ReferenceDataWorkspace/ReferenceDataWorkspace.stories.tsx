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
export const Empty: Story = {
  name: "Пустой справочник",
  args: { initialEntries: [] },
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
