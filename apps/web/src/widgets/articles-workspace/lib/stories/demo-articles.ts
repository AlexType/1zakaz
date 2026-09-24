import type { Article } from "@/entities/article";

export const DEMO_ARTICLES: Article[] = [
  {
    id: "1",
    title: "Как выбрать автомобиль из Японии",
    slug: "kak-vybrat-avtomobil-iz-yaponii",
    excerpt:
      "На что смотреть при выборе автомобиля и как оценить состояние до покупки.",
    categoryId: "guides",
    tags: ["Япония", "подбор", "аукцион"],
    coverUrl: "https://placecats.com/neo/300/200",
    coverAlt: "Автомобиль на японском аукционе",
    content: [
      { type: "heading", props: { level: 2 }, content: "С чего начать" },
      {
        type: "paragraph",
        content: "Определите бюджет и требования к автомобилю.",
      },
      {
        type: "callout",
        props: { tone: "info" },
        content:
          "Не ориентируйтесь только на аукционную оценку — изучайте замечания инспектора.",
      },
    ],
    status: "published",
    authorName: "Петрова Анна Сергеевна",
    seoTitle: "Как выбрать автомобиль из Японии",
    seoDescription:
      "На что смотреть при выборе автомобиля и как оценить состояние до покупки.",
    ogImageUrl: "https://placecats.com/neo/300/200",
    updatedAt: "2026-09-22T07:25:00Z",
    publishedAt: "2026-09-20T05:00:00Z",
  },
  {
    id: "2",
    title: "Доставка автомобиля из Китая",
    slug: "dostavka-avtomobilya-iz-kitaya",
    excerpt: "Этапы доставки и документы, которые понадобятся при оформлении.",
    categoryId: "delivery",
    tags: ["Китай", "доставка"],
    coverUrl: "https://placecats.com/millie/300/200",
    coverAlt: "Доставка автомобиля из Китая",
    content: [
      {
        type: "paragraph",
        content: "Здесь будет проверенная инструкция по доставке.",
      },
    ],
    status: "draft",
    authorName: "Орлов Михаил Петрович",
    seoTitle: "Доставка автомобиля из Китая",
    seoDescription: "Этапы доставки и документы для оформления автомобиля.",
    ogImageUrl: "https://placecats.com/millie/300/200",
    updatedAt: "2026-09-21T08:40:00Z",
    publishedAt: null,
  },
  {
    id: "3",
    title: "Какие документы нужны для покупки",
    slug: "dokumenty-dlya-pokupki",
    excerpt: "Собрали список документов для покупки и оформления автомобиля.",
    categoryId: "guides",
    tags: ["документы"],
    coverUrl: null,
    coverAlt: "",
    content: [
      {
        type: "paragraph",
        content: "Проверьте актуальный список документов с менеджером.",
      },
    ],
    status: "published",
    authorName: "Петрова Анна Сергеевна",
    seoTitle: "Какие документы нужны для покупки автомобиля",
    seoDescription: "Список документов для покупки и оформления автомобиля.",
    ogImageUrl: null,
    updatedAt: "2026-09-18T11:15:00Z",
    publishedAt: "2026-09-18T11:15:00Z",
  },
];
