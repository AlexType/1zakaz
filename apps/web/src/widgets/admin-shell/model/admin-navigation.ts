import {
  IconArticle,
  IconCar,
  IconCalculator,
  IconClipboardList,
  IconListDetails,
  IconWorld,
  IconUsers,
} from "@tabler/icons-react";

export type AdminSection =
  | "leads"
  | "cars"
  | "pricing"
  | "articles"
  | "site"
  | "references"
  | "staff"
  | "profile";

export const ADMIN_NAV_ITEMS = [
  { id: "leads", label: "Заявки", icon: IconClipboardList },
  { id: "cars", label: "Автомобили", icon: IconCar },
  {
    id: "pricing",
    label: "Цены и калькуляторы",
    icon: IconCalculator,
    adminOnly: true,
  },
  { id: "articles", label: "Статьи", icon: IconArticle },
  { id: "site", label: "Сайт", icon: IconWorld, adminOnly: true },
  {
    id: "references",
    label: "Справочники",
    icon: IconListDetails,
    adminOnly: true,
  },
  { id: "staff", label: "Сотрудники", icon: IconUsers, adminOnly: true },
] as const;
