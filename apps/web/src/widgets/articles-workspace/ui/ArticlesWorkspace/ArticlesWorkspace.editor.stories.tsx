import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ArticlesWorkspace } from "./ArticlesWorkspace";

const meta = {
  title: "Панель управления/Статьи/Редактор",
  component: ArticlesWorkspace,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Редактор статьи с предпросмотром, обложкой, рубрикой и текстом Tiptap. Черновик сохраняется отдельно от публикации. Демонстрационные изменения остаются в памяти Storybook. API должен формировать уникальный адрес статьи, сохранять структурированный JSON, обложку, автора и даты.",
      },
    },
  },
} satisfies Meta<typeof ArticlesWorkspace>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Create: Story = {
  name: "Создание",
  args: { initialView: "create" },
};

export const Edit: Story = {
  name: "Редактирование",
  args: { initialView: "edit" },
};
