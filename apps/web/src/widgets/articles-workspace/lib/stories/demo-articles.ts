import type { Article } from "@/entities/article";

export const DEMO_ARTICLES: Article[] = [
  {
    id: "1",
    title: "Как выбрать автомобиль из Японии",
    slug: "kak-vybrat-avtomobil-iz-yaponii",
    excerpt:
      "На что смотреть при выборе автомобиля и как оценить состояние до покупки.",
    categoryId: "guides",
    coverUrl: "https://placecats.com/neo/300/200",
    body: {
      type: "doc",
      content: [
        {
          type: "heading",
          attrs: { level: 2 },
          content: [{ type: "text", text: "С чего начать" }],
        },
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: "Определите бюджет и требования к автомобилю.",
            },
          ],
        },
      ],
    },
    status: "published",
    authorName: "Петрова Анна Сергеевна",
    updatedAt: "2026-09-22T07:25:00Z",
    publishedAt: "2026-09-20T05:00:00Z",
  },
  {
    id: "2",
    title: "Доставка автомобиля из Китая",
    slug: "dostavka-avtomobilya-iz-kitaya",
    excerpt: "Этапы доставки и документы, которые понадобятся при оформлении.",
    categoryId: "delivery",
    coverUrl: "https://placecats.com/millie/300/200",
    body: {
      type: "doc",
      content: [
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: "Здесь будет проверенная инструкция по доставке.",
            },
          ],
        },
      ],
    },
    status: "draft",
    authorName: "Орлов Михаил Петрович",
    updatedAt: "2026-09-21T08:40:00Z",
    publishedAt: null,
  },
  {
    id: "3",
    title: "Какие документы нужны для покупки",
    slug: "dokumenty-dlya-pokupki",
    excerpt: "Собрали список документов для покупки и оформления автомобиля.",
    categoryId: "guides",
    coverUrl: null,
    body: {
      type: "doc",
      content: [
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: "Проверьте актуальный список документов с менеджером.",
            },
          ],
        },
      ],
    },
    status: "published",
    authorName: "Петрова Анна Сергеевна",
    updatedAt: "2026-09-18T11:15:00Z",
    publishedAt: "2026-09-18T11:15:00Z",
  },
];
