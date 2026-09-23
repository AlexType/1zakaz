import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { AuthShell } from "../AuthShell";
import { SignInForm } from "./SignInForm";

const noop = () => {};

const meta = {
  title: "Авторизация/Состояния входа",
  component: SignInForm,
  args: {
    busy: false,
    error: null,
    onEmailCode: noop,
    onPassword: noop,
    onRecovery: noop,
  },
  render: (args) => (
    <AuthShell
      title="Вход в панель управления"
      description="Для сотрудников Первого заказа"
    >
      <SignInForm {...args} />
    </AuthShell>
  ),
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof SignInForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Password: Story = {
  name: "Почта и пароль",
  args: { initialMethod: "password" },
};
export const InvalidCredentials: Story = {
  name: "Неверные данные",
  args: {
    initialMethod: "password",
    error:
      "Не удалось войти. Проверьте данные или выберите другой способ входа.",
  },
};
export const Submitting: Story = {
  name: "Отправка формы",
  args: { busy: true },
};
