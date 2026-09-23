import { Alert, Button, Stack, Text } from "@mantine/core";
import { IconCheck } from "@tabler/icons-react";
import type { AuthScreen } from "../../lib/use-staff-auth-flow";
import { AuthShell } from "../AuthShell";

type Status = Extract<
  AuthScreen,
  "invite-complete" | "recovery-complete" | "authenticated"
>;

const content: Record<
  Status,
  { title: string; description: string; message: string }
> = {
  "invite-complete": {
    title: "Почта подтверждена",
    description:
      "Учётная запись создана. Теперь можно войти с кодом на почту. Пароль можно настроить в профиле.",
    message: "Приглашение использовано.",
  },
  "recovery-complete": {
    title: "Проверьте почту",
    description: "Если адрес есть в системе, на него придут инструкции.",
    message: "Запрос принят.",
  },
  authenticated: {
    title: "Вы вошли",
    description: "Открываем панель управления.",
    message: "Проверка пройдена.",
  },
};

export function StatusScreen({
  screen,
  onBack,
}: {
  screen: Status;
  onBack: () => void;
}) {
  const { title, description, message } = content[screen];

  return (
    <AuthShell title={title} description={description}>
      <Stack gap="md">
        <Alert color="teal" icon={<IconCheck size={18} />}>
          {message}
        </Alert>
        {screen === "authenticated" ? (
          <Text size="sm" c="dimmed">
            Если рабочий стол не открылся, обновите страницу или обратитесь к
            администратору.
          </Text>
        ) : (
          <Button onClick={onBack} fullWidth>
            Перейти ко входу
          </Button>
        )}
      </Stack>
    </AuthShell>
  );
}
