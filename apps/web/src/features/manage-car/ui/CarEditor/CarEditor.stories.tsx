import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import {
  demoBrands,
  demoCar,
  demoManagers,
  demoModels,
  demoPhotos,
} from "../../lib/stories/car-editor-examples";
import { CarEditor } from "./CarEditor";

const meta = {
  title: "Панель управления/Автомобили/Редактор",
  component: CarEditor,
  args: {
    mode: "create",
    brands: demoBrands,
    models: demoModels,
    managers: demoManagers,
    onSave: fn(),
    onCancel: fn(),
    onDelete: fn(),
  },
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Карточка автомобиля: характеристики, справочники стран и цветов, форматированные числовые поля, описание с форматированием. Фотографии добавляются, открываются в полноэкранной галерее и сортируются перетаскиванием за ручку; первое фото становится обложкой. Сохранение передаёт данные и файлы обработчику. Автоматический расчёт цены будет подключён к API.",
      },
    },
  },
} satisfies Meta<typeof CarEditor>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Create: Story = { name: "Создание" };

export const Edit: Story = {
  name: "Редактирование",
  args: { mode: "edit", initialValues: demoCar, initialPhotos: demoPhotos },
};

export const Duplicate: Story = {
  name: "Создание копии",
  args: {
    mode: "duplicate",
    initialValues: { ...demoCar, publicationStatus: "draft" },
    initialPhotos: demoPhotos,
  },
};

export const SaveError: Story = {
  name: "Ошибка сохранения",
  args: {
    mode: "edit",
    initialValues: demoCar,
    initialPhotos: demoPhotos,
    onSave: fn(async () => {
      throw new Error("Mock API error");
    }),
  },
};
export const ValidationErrors: Story = {
  name: "Ошибки валидации",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: "Сохранить" }));
    await expect(canvas.getByText("Выберите марку")).toBeVisible();
  },
};
export const Mobile: Story = {
  name: "Телефон",
  args: { mode: "edit", initialValues: demoCar, initialPhotos: demoPhotos },
  parameters: { viewport: { defaultViewport: "mobile1" } },
};
