"use client";

import { Alert } from "@mantine/core";
import { IconInfoCircle } from "@tabler/icons-react";
import {
  useStaffAuthFlow,
  type StaffAuthFlowOptions,
} from "../../lib/use-staff-auth-flow";
import { AuthShell } from "../AuthShell";
import { CodeForm } from "../CodeForm";
import { InvitationForm } from "../InvitationForm";
import { RecoveryForm } from "../RecoveryForm";
import { SignInForm } from "../SignInForm";
import { StatusScreen } from "../StatusScreen";

const codeScreens = {
  "email-code": {
    title: "Проверьте почту",
    description: "Введите код из письма.",
  },
  "invite-code": {
    title: "Проверьте почту",
    description: "Подтвердите адрес, указанный при регистрации.",
  },
} as const;

export function StaffAuthFlow(options: StaffAuthFlowOptions) {
  const flow = useStaffAuthFlow(options);
  const { screen, busy, error, challenge, goTo } = flow;

  if (screen === "login") {
    return (
      <AuthShell
        title="Вход в панель управления"
        description="Для сотрудников Первого заказа"
      >
        <SignInForm
          busy={busy}
          error={error}
          onEmailCode={flow.requestEmailCode}
          onPassword={flow.signInWithPassword}
          onRecovery={() => goTo("recovery")}
        />
      </AuthShell>
    );
  }

  if (screen === "email-code" || screen === "invite-code") {
    const { title, description } = codeScreens[screen];
    return (
      <AuthShell title={title} description={description}>
        <CodeForm
          key={`${screen}-${challenge?.id}-${flow.challengeVersion}`}
          destination={challenge?.destination ?? "указанную почту"}
          resendAfterSeconds={challenge?.resendAfterSeconds ?? 0}
          busy={busy}
          error={error}
          onVerify={flow.verifyCode}
          onResend={flow.resendCode}
          onBack={screen === "invite-code" ? undefined : () => goTo("login")}
        />
      </AuthShell>
    );
  }

  if (screen === "invite" && options.invitation) {
    return (
      <AuthShell
        title="Создайте учётную запись"
        description="Заполните данные для доступа к панели управления."
      >
        <InvitationForm
          roleName={options.invitation.roleName}
          expiresAt={options.invitation.expiresAt}
          busy={busy}
          error={error}
          onSubmit={flow.acceptInvitation}
        />
      </AuthShell>
    );
  }

  if (screen === "recovery") {
    return (
      <AuthShell
        title="Восстановление доступа"
        description="Укажите почту своей учётной записи."
      >
        <RecoveryForm
          busy={busy}
          error={error}
          onSubmit={flow.requestRecovery}
          onBack={() => goTo("login")}
        />
      </AuthShell>
    );
  }

  if (screen === "invite-invalid" || screen === "invite") {
    return (
      <AuthShell
        title="Ссылка недействительна"
        description="Приглашение истекло или уже использовано."
      >
        <Alert color="orange" icon={<IconInfoCircle size={18} />}>
          Попросите администратора отправить новое приглашение.
        </Alert>
      </AuthShell>
    );
  }

  return <StatusScreen screen={screen} onBack={() => goTo("login")} />;
}
