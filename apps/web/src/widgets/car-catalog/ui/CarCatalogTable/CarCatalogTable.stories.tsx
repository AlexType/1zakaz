import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn } from "storybook/test";
import { catalogCars } from "../../lib/stories/catalog-cars";
import { CarCatalogTable } from "./CarCatalogTable";
import { CarCatalogDemo } from "../CarCatalogDemo";

const meta = {
  title: "Панель управления/Автомобили/Список",
  component: CarCatalogTable,
  args: {
    cars: catalogCars,
    onCreate: fn(),
    onEdit: fn(),
    onDuplicate: fn(),
    onRetry: fn(),
  },
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Рабочая таблица конкретных автомобилей с общей панелью фильтров, сортировкой, пагинацией и настройками колонок. Строки компактные. Фото с placecats.com служат заглушками. «Черновик / Опубликован» — видимость карточки, а не наличие машины или этап доставки. Рабочие статусы и окончательные поля ещё согласуются. После появления API поиск, фильтрация, сортировка и пагинация будут серверными.",
      },
    },
  },
} satisfies Meta<typeof CarCatalogTable>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { name: "Основной вид" };
export const Interactive: Story = {
  name: "Переход к редактору",
  render: () => <CarCatalogDemo />,
};
export const Drafts: Story = {
  name: "Черновики и неполные данные",
  args: {
    cars: catalogCars.filter((car) => car.publicationStatus === "draft"),
  },
};
export const WithoutPrices: Story = {
  name: "Карточки без цены",
  args: {
    cars: catalogCars.filter((car) => car.priceRub === null),
  },
};
export const Empty: Story = {
  name: "Пустой список",
  args: { cars: [] },
};
export const Loading: Story = {
  name: "Загрузка",
  args: { cars: [], loading: true },
};
export const Error: Story = {
  name: "Ошибка загрузки",
  args: { cars: [], error: "Попробуйте ещё раз через несколько минут." },
};
export const Mobile: Story = {
  name: "Телефон",
  parameters: { viewport: { defaultViewport: "mobile1" } },
};
