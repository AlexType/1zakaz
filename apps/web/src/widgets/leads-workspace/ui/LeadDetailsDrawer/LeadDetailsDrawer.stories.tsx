import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, fn, within } from "storybook/test";
import type { Lead } from "@/entities/lead";
import { DEMO_LEADS, DEMO_LEAD_MANAGERS } from "../../lib/stories/leads-demo";
import { LeadDetailsDrawer } from "./LeadDetailsDrawer";

const NEW_LEAD: Lead = {
  id: "new-story",
  createdAt: "2026-09-24T08:00:00Z",
  updatedAt: "2026-09-24T08:00:00Z",
  clientName: "",
  phone: "",
  email: null,
  status: "new",
  source: "Телефон",
  country: null,
  subject: "",
  message: "",
  vehicleQuery: null,
  vehicleType: null,
  condition: null,
  budgetRub: null,
  deliveryCity: null,
  purchaseTiming: null,
  wishes: null,
  preferredContactMethod: null,
  managerName: null,
  managerAvatarUrl: null,
  nextActionAt: null,
  pageUrl: "",
  carLabel: null,
  calculationId: null,
  utm: null,
  notes: [],
};

const meta = {
  title: "Панель управления/Заявки/Карточка",
  component: LeadDetailsDrawer,
  args: {
    opened: true,
    managerOptions: DEMO_LEAD_MANAGERS,
    onClose: fn(),
    onChange: fn(),
    onCreate: fn(),
  },
  argTypes: {
    onClose: { control: false },
    onChange: { control: false },
    onCreate: { control: false },
  },
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Плотная рабочая карточка заявки. Рабочие поля сохраняются автоматически, заметки добавляются отдельным действием, а пользовательские ответы отделены от системного контекста.",
      },
    },
  },
} satisfies Meta<typeof LeadDetailsDrawer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const FromSelectionForm: Story = {
  name: "Из формы подбора",
  args: { lead: DEMO_LEADS[0] },
  play: async ({ canvasElement }) => {
    const screen = within(canvasElement.ownerDocument.body);
    await expect(screen.getByText("Хабаровск")).toBeVisible();
    await expect(
      screen.getByText("Полный привод, не старше 2022 года."),
    ).toBeVisible();
    await expect(screen.getByText("Системные данные")).toBeVisible();
  },
};

export const FromCar: Story = {
  name: "Из карточки автомобиля",
  args: { lead: DEMO_LEADS[1] },
};

export const NewLead: Story = {
  name: "Новая вручную",
  args: { lead: NEW_LEAD },
};
