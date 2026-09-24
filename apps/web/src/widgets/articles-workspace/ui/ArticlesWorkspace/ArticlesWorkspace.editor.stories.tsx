import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import type { Article } from "@/entities/article";
import { DEMO_ARTICLES } from "../../lib/stories/demo-articles";
import { ArticlesWorkspace } from "./ArticlesWorkspace";

const customBlocksArticle: Article = {
  ...DEMO_ARTICLES[1],
  id: "custom-blocks",
  title: "Из чего складывается стоимость автомобиля",
  slug: "stoimost-avtomobilya",
  content: [
    { type: "heading", props: { level: 2 }, content: "Главное о расчёте" },
    {
      type: "callout",
      props: { tone: "warning" },
      content: "Финальная стоимость зависит от курса на дату оплаты.",
    },
    {
      type: "gallery",
      props: {
        images: JSON.stringify([
          "https://placecats.com/neo/640/420",
          "https://placecats.com/millie/640/420",
        ]),
        columns: 2,
      },
    },
    {
      type: "cta",
      props: { url: "/calculator", buttonLabel: "Рассчитать" },
      content: "Получите предварительный расчёт под ваш бюджет",
    },
  ],
};

const meta = {
  title: "Панель управления/Статьи/Редактор",
  component: ArticlesWorkspace,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Редактор статьи: меню команд, перетаскивание блоков, плавающая панель, автосохранение и компактные настройки публикации. Данные и загрузка изображений в историях моковые.",
      },
    },
  },
} satisfies Meta<typeof ArticlesWorkspace>;

export default meta;
type Story = StoryObj<typeof meta>;

export const New: Story = {
  name: "Новая",
  args: { initialView: "create" },
};

export const Draft: Story = {
  name: "Черновик",
  args: { initialView: "edit", initialArticles: [DEMO_ARTICLES[1]] },
};

export const Published: Story = {
  name: "Опубликованная",
  args: { initialView: "edit", initialArticles: [DEMO_ARTICLES[0]] },
};

export const CustomBlocks: Story = {
  name: "Свои блоки",
  args: { initialView: "edit", initialArticles: [customBlocksArticle] },
};

export const Preview: Story = {
  name: "Предпросмотр",
  args: {
    initialView: "edit",
    initialEditorMode: "preview",
    initialArticles: [customBlocksArticle],
  },
};

export const Mobile: Story = {
  name: "Телефон",
  args: { initialView: "edit", initialArticles: [DEMO_ARTICLES[1]] },
  parameters: {
    viewport: { defaultViewport: "mobile1" },
  },
};
