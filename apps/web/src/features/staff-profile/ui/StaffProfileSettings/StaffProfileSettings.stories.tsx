import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import {
  demoProfile,
  demoProfileActions,
} from "../../lib/stories/profile-examples";
import { StaffProfileSettings } from "./StaffProfileSettings";

const meta = {
  title: "Панель управления/Профиль/Настройки",
  component: StaffProfileSettings,
  args: { initialProfile: demoProfile, actions: demoProfileActions },
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Личные данные, загрузка и повторное кадрирование аватара, контакты и настройка пароля. Изменения работают локально через демонстрационный адаптер. Для проверки почты используйте код 123456. Настоящий API должен хранить исходное фото, повторно подтверждать личность при смене почты и пароля и проверять код почты.",
      },
    },
  },
} satisfies Meta<typeof StaffProfileSettings>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { name: "Основной вид" };
export const WithAvatar: Story = {
  name: "С фотографией",
  args: {
    initialProfile: {
      ...demoProfile,
      avatarUrl: "/storybook-avatar.svg",
      avatarSourceUrl: "/storybook-avatar.svg",
    },
  },
};
export const NewEmployee: Story = {
  name: "Новый сотрудник",
  args: { initialProfile: demoProfile },
};
export const SaveError: Story = {
  name: "Ошибка сохранения",
  args: {
    actions: {
      ...demoProfileActions,
      savePersonalDetails: async () => {
        throw new Error("Unavailable");
      },
    },
  },
};
