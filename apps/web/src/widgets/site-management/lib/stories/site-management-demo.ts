import type {
  CompanyDetails,
  LegalDocument,
  NavigationItem,
  SitePage,
  SiteRedirect,
  SiteFormSettings,
  SiteArticleOption,
} from "../../model/site-management";

export const DEMO_SITE_PAGES: SitePage[] = [
  {
    id: "home",
    title: "Главная",
    path: "/",
    heading: "Автомобили из Японии, Кореи и Китая",
    lead: "Подбираем, покупаем и доставляем автомобили с понятным расчётом стоимости.",
    status: "published",
    updatedAt: "2026-09-23T02:20:00Z",
    blocks: [
      {
        id: "directions",
        title: "Направления",
        enabled: true,
        source: "manual",
      },
      { id: "cars", title: "Автомобили", enabled: true, source: "cars" },
      {
        id: "steps",
        title: "Как проходит заказ",
        enabled: true,
        source: "manual",
      },
      {
        id: "cases",
        title: "Привезённые автомобили",
        enabled: true,
        source: "cases",
      },
      {
        id: "articles",
        title: "Полезные материалы",
        enabled: true,
        source: "articles",
      },
      {
        id: "request",
        title: "Заявка на подбор",
        enabled: true,
        source: "manual",
      },
    ],
  },
  {
    id: "how-to-order",
    title: "Как заказать",
    path: "/how-to-order",
    heading: "Как проходит покупка автомобиля",
    lead: "От заявки и договора до выдачи автомобиля в вашем городе.",
    status: "published",
    updatedAt: "2026-09-22T08:10:00Z",
    blocks: [
      { id: "steps", title: "Этапы заказа", enabled: true, source: "manual" },
    ],
  },
  {
    id: "about",
    title: "О компании",
    path: "/about",
    heading: "Первый заказ",
    lead: "Команда, документы и условия работы.",
    status: "draft",
    updatedAt: "2026-09-21T06:45:00Z",
    blocks: [{ id: "team", title: "Команда", enabled: true, source: "manual" }],
  },
  {
    id: "contacts",
    title: "Контакты",
    path: "/contacts",
    heading: "Связаться с нами",
    lead: "Телефон, мессенджеры, адрес и режим работы.",
    status: "published",
    updatedAt: "2026-09-20T04:15:00Z",
    blocks: [
      {
        id: "contacts",
        title: "Контакты и карта",
        enabled: true,
        source: "manual",
      },
    ],
  },
];

export const DEMO_NAVIGATION: NavigationItem[] = [
  {
    id: "cars",
    label: "Автомобили",
    url: "/cars",
    placement: "both",
    enabled: true,
  },
  {
    id: "japan",
    label: "Япония",
    url: "/japan",
    placement: "header",
    enabled: true,
  },
  {
    id: "china",
    label: "Китай",
    url: "/china",
    placement: "header",
    enabled: true,
  },
  {
    id: "korea",
    label: "Корея",
    url: "/korea",
    placement: "header",
    enabled: true,
  },
  {
    id: "process",
    label: "Как заказать",
    url: "/how-to-order",
    placement: "both",
    enabled: true,
  },
  {
    id: "articles",
    label: "Статьи",
    url: "/articles",
    placement: "both",
    enabled: true,
  },
  {
    id: "contacts",
    label: "Контакты",
    url: "/contacts",
    placement: "both",
    enabled: true,
  },
];

export const DEMO_COMPANY: CompanyDetails = {
  publicName: "Первый заказ",
  legalName: "ООО «Первый заказ»",
  inn: "2540000000",
  ogrn: "1232500000000",
  address: "Владивосток",
  phone: "+7 999 000-00-00",
  email: "info@perviyzakaz.ru",
  telegramUrl: "https://t.me/perviyzakaz",
  whatsappUrl: "https://wa.me/79990000000",
  workingHours: "Ежедневно, 09:00–19:00",
};

export const DEMO_LEGAL_DOCUMENTS: LegalDocument[] = [
  {
    id: "privacy",
    title: "Политика обработки персональных данных",
    path: "/privacy",
    status: "published",
    updatedAt: "2026-09-18T05:00:00Z",
    content: {
      type: "doc",
      content: [
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: "Политика определяет порядок обработки и защиты персональных данных посетителей сайта.",
            },
          ],
        },
      ],
    },
  },
  {
    id: "consent",
    title: "Согласие на обработку персональных данных",
    path: "/personal-data-consent",
    status: "published",
    updatedAt: "2026-09-18T05:10:00Z",
    content: {
      type: "doc",
      content: [
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: "Пользователь подтверждает согласие на обработку данных, указанных в форме обращения.",
            },
          ],
        },
      ],
    },
  },
];

export const DEMO_REDIRECTS: SiteRedirect[] = [
  {
    id: "old-catalog",
    sourcePath: "/catalog/",
    destinationPath: "/cars",
    enabled: true,
  },
  {
    id: "old-news",
    sourcePath: "/news/",
    destinationPath: "/articles",
    enabled: true,
  },
];

export const DEMO_SITE_ARTICLES: SiteArticleOption[] = [
  { value: "order-process", label: "Как проходит заказ автомобиля" },
  { value: "auction-sheet", label: "Как читать аукционный лист" },
  { value: "price-structure", label: "Из чего складывается стоимость" },
];

export const DEMO_SITE_FORMS: SiteFormSettings[] = [
  {
    id: "car-selection",
    name: "Заявка на подбор",
    successTitle: "Заявка отправлена",
    successMessage: "Мы получили заявку и передали её менеджеру.",
    responseTimeText: "Свяжемся с вами в рабочее время в течение 30 минут.",
    suggestedArticleIds: ["order-process", "price-structure"],
    consentDocumentId: "consent",
  },
  {
    id: "car-question",
    name: "Вопрос по автомобилю",
    successTitle: "Вопрос отправлен",
    successMessage: "Менеджер получил ваш вопрос и ссылку на автомобиль.",
    responseTimeText: "Ответим в рабочее время в течение 30 минут.",
    suggestedArticleIds: ["order-process"],
    consentDocumentId: "consent",
  },
  {
    id: "calculation-request",
    name: "Уточнение расчёта",
    successTitle: "Расчёт отправлен",
    successMessage: "Мы получили параметры и проверим расчёт вручную.",
    responseTimeText: "Менеджер свяжется с вами в рабочее время.",
    suggestedArticleIds: ["price-structure"],
    consentDocumentId: "consent",
  },
];
