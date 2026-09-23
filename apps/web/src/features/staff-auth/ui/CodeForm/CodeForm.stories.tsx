import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { AuthShell } from "../AuthShell";
import { CodeForm } from "./CodeForm";

const noop = () => {};

const meta = {
  title: "Авторизация/Состояния подтверждения",
  component: CodeForm,
  args: {
    destination: "n•••@example.ru",
    resendAfterSeconds: 0,
    busy: false,
    error: null,
    onVerify: noop,
    onResend: noop,
    onBack: noop,
  },
  render: (args) => (
    <AuthShell title="Проверьте почту" description="Введите код из письма.">
      <CodeForm {...args} />
    </AuthShell>
  ),
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof CodeForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const InvalidCode: Story = {
  name: "Неверный код",
  args: { error: "Код не подошёл. Проверьте цифры и попробуйте ещё раз." },
};
export const ExpiredCode: Story = {
  name: "Истёкший код",
  args: { error: "Срок действия кода истёк. Запросите новый код." },
};
export const RateLimited: Story = {
  name: "Лимит попыток",
  args: {
    error: "Слишком много попыток. Попробуйте позже.",
    resendAfterSeconds: 60,
  },
};
