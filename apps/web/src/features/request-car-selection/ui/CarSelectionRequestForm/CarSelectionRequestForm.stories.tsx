import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, userEvent, within } from "storybook/test";
import type {
  CarSelectionRequestSubmission,
  CarSelectionRequestValues,
} from "../../model/car-selection-request";
import { CarSelectionRequestForm } from "./CarSelectionRequestForm";

const FILLED_VALUES: CarSelectionRequestValues = {
  selectionMode: "specific",
  vehicleQuery: "Toyota RAV4 или Honda Vezel",
  vehicleType: "",
  country: "japan",
  condition: "used",
  budgetRub: "3000000",
  deliveryCity: "Хабаровск",
  purchaseTiming: "one-to-three-months",
  wishes: "Полный привод, не старше 2022 года.",
  clientName: "Анна",
  phone: "+7 999 123-45-67",
  contactMethod: "telegram",
  personalDataConsent: true,
};

const SUCCESS_SUBMISSION: CarSelectionRequestSubmission = {
  ...FILLED_VALUES,
  vehicleQuery: "Toyota RAV4",
  phone: "+79991234567",
};

const meta = {
  title: "Публичный сайт/Формы/Подбор автомобиля",
  component: CarSelectionRequestForm,
  args: {
    onSubmit: async () => undefined,
  },
  argTypes: {
    onSubmit: { control: false },
    initialSubmission: { control: false },
  },
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Компактная трёхшаговая заявка на подбор и привоз автомобиля. Значения сохраняются между шагами, контекст карточки или расчёта предзаполняет поля; API пока не вызывается.",
      },
    },
  },
} satisfies Meta<typeof CarSelectionRequestForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: "Основной вид",
};

export const Filled: Story = {
  name: "Заполненная форма",
  args: {
    initialValues: FILLED_VALUES,
    initialStep: 2,
  },
};

export const FromCar: Story = {
  name: "Из карточки автомобиля",
  args: {
    source: {
      kind: "car",
      carId: "car-geely-monjaro-2025",
      vehicleLabel: "Geely Monjaro, 2025",
      country: "china",
      condition: "new",
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByLabelText(/Марка и модель/)).toHaveValue(
      "Geely Monjaro, 2025",
    );
    await expect(
      canvas.queryByText("Автомобиль из каталога"),
    ).not.toBeInTheDocument();
  },
};

export const FromCalculator: Story = {
  name: "Из калькулятора",
  args: {
    source: {
      kind: "calculator",
      calculationId: "CALC-851",
      country: "korea",
      vehicleLabel: "Hyundai Palisade, 2022",
      budgetRub: 4200000,
      deliveryCity: "Москва",
    },
    initialValues: {
      condition: "used",
    },
    initialStep: 1,
  },
};

export const ValidationErrors: Story = {
  name: "Ошибки валидации",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.queryByText("Выберите, знаете ли вы конкретную модель"),
    ).not.toBeInTheDocument();
    await userEvent.click(canvas.getByRole("button", { name: "Продолжить" }));
    await expect(
      canvas.getByText("Выберите, знаете ли вы конкретную модель"),
    ).toBeVisible();
    await expect(
      canvas.getByText("Выберите страну или вариант «Не знаю»"),
    ).toBeVisible();
  },
};

export const Success: Story = {
  name: "Успешная отправка",
  args: {
    initialSubmission: SUCCESS_SUBMISSION,
  },
};

export const Mobile: Story = {
  name: "Мобильный экран",
  parameters: {
    viewport: {
      defaultViewport: "mobile1",
    },
  },
};
