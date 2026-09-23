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
          "Рабочая таблица конкретных автомобилей на Mantine DataTable 9. Марка, модель, год, страна, цена и другие данные находятся в отдельных колонках. Фильтры находятся в заголовках соответствующих колонок; сортировка и пагинация работают на демонстрационных записях. В меню «Вид таблицы» можно выбрать обычную или компактную плотность строк и скрыть ненужные поля; ширину и порядок колонок можно менять в заголовке. Настройки сохраняются в браузере. Фото с placecats.com служат заглушками. «Черновик / Опубликован» — видимость карточки, а не наличие машины или этап доставки. Рабочие статусы и окончательные поля ещё согласуются. После появления API поиск, фильтрация, сортировка и пагинация будут серверными; действия создания и редактирования подключатся к маршрутам приложения.",
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
