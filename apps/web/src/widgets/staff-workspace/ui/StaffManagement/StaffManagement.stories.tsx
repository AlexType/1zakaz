import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { DEMO_STAFF } from "../../lib/stories/demo-staff";
import { StaffWorkspaceDemo } from "../StaffWorkspaceDemo";
import { StaffManagement } from "./StaffManagement";

const meta = {
  title: "Панель управления/Сотрудники/Список",
  component: StaffManagement,
  args: {
    members: DEMO_STAFF,
    currentUserId: "1",
    onSetRole: async () => {},
    onSetStatus: async () => {},
    onCreateInvitation: async () => ({
      url: "https://perviyzakaz.ru/admin/invite/storybook-demo",
      expiresAt: new Date(Date.now() + 86400000).toISOString(),
    }),
  },
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Фильтры в колонках, сортировка, настройка вида, приглашение по одноразовой ссылке, изменение роли и закрытие доступа с подтверждением. В интерактивной истории изменения сохраняются в памяти браузера. Текущий сотрудник и последний действующий администратор защищены от случайного закрытия доступа; API обязан повторять эту проверку и проверять полномочия.",
      },
    },
  },
} satisfies Meta<typeof StaffManagement>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {
  name: "Основной вид",
  render: () => <StaffWorkspaceDemo />,
};
export const Empty: Story = {
  name: "Пустой список",
  render: () => <StaffWorkspaceDemo initialMembers={[]} />,
};
export const Loading: Story = {
  name: "Загрузка",
  render: () => <StaffWorkspaceDemo loading />,
};
export const LoadError: Story = {
  name: "Ошибка загрузки",
  render: () => (
    <StaffWorkspaceDemo error="Проверьте соединение и попробуйте ещё раз." />
  ),
};
export const Mobile: Story = {
  name: "Телефон",
  render: () => <StaffWorkspaceDemo />,
  parameters: { viewport: { defaultViewport: "mobile1" } },
};
