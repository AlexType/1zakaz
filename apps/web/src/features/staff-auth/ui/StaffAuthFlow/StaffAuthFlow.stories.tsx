import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { demoGateway } from "../../lib/stories/demo-gateway";
import { StaffAuthFlow } from "./StaffAuthFlow";

const challenge = {
  id: "preview-challenge",
  destination: "n•••@example.ru",
  resendAfterSeconds: 0,
};

const invitation = {
  token: "storybook-only-token",
  roleName: "Менеджер",
  expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
};

const meta = {
  title: "Панель управления/Доступ сотрудников",
  component: StaffAuthFlow,
  args: { gateway: demoGateway },
  argTypes: { gateway: { control: false } },
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Интерактивный прототип без API. В Storybook проверочный код — 123456, пароль — demo-password. Роль и действительность приглашения в реальном приложении определит сервер.",
      },
    },
  },
} satisfies Meta<typeof StaffAuthFlow>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SignIn: Story = { name: "Вход" };
export const EmailCode: Story = {
  name: "Код на почту",
  args: { initialScreen: "email-code", previewChallenge: challenge },
};
export const TotpForAdmin: Story = {
  name: "TOTP администратора",
  args: { initialScreen: "totp", previewChallenge: challenge },
};
export const Invitation: Story = {
  name: "Регистрация по приглашению",
  args: { invitation },
};
export const InvitationEmailCode: Story = {
  name: "Подтверждение почты",
  args: {
    initialScreen: "invite-code",
    invitation,
    previewChallenge: challenge,
  },
};
export const InvalidInvitation: Story = {
  name: "Недействительная ссылка",
  args: { initialScreen: "invite-invalid" },
};
export const InvitationComplete: Story = {
  name: "Регистрация завершена",
  args: { initialScreen: "invite-complete" },
};
export const Recovery: Story = {
  name: "Восстановление доступа",
  args: { initialScreen: "recovery" },
};
export const RecoveryRequested: Story = {
  name: "Запрос восстановления принят",
  args: { initialScreen: "recovery-complete" },
};
export const SignedIn: Story = {
  name: "Вход выполнен",
  args: { initialScreen: "authenticated" },
};
