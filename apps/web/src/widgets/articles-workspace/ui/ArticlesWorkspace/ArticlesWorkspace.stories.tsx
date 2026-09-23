import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ArticlesWorkspace } from "./ArticlesWorkspace";

const meta = {
  title: "Панель управления/Статьи/Список",
  component: ArticlesWorkspace,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Список статей с фильтрами в колонках, сортировкой и настройками вида. Из списка можно открыть отдельный редактор статьи. Данные остаются в памяти Storybook; после подключения API фильтрация, сортировка и пагинация будут серверными.",
      },
    },
  },
} satisfies Meta<typeof ArticlesWorkspace>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = { name: "Основной вид" };
export const Empty: Story = {
  name: "Пустой список",
  args: { initialArticles: [] },
};
export const Loading: Story = {
  name: "Загрузка",
  args: { loading: true },
};
export const LoadError: Story = {
  name: "Ошибка загрузки",
  args: { error: "Проверьте соединение и попробуйте ещё раз." },
};
