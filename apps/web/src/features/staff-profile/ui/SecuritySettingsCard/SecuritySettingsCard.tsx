import { Badge, Button, Group, Paper, Stack, Text, Title } from "@mantine/core";
import { IconLockPassword } from "@tabler/icons-react";
import type { StaffAccount } from "@/entities/employee";

type SecuritySettingsCardProps = {
  profile: StaffAccount;
  onSetPassword: () => void;
};

export function SecuritySettingsCard({
  profile,
  onSetPassword,
}: SecuritySettingsCardProps) {
  return (
    <Paper withBorder radius="lg" p="lg">
      <Stack gap="lg">
        <div>
          <Title order={2} size="h4">
            Способы входа
          </Title>
        </div>
        <Group justify="space-between" align="center" gap="md">
          <Group gap="sm" wrap="nowrap">
            <IconLockPassword size={22} />
            <div>
              <Text fw={600}>Пароль</Text>
              <Text size="sm" c="dimmed">
                Вход по почте и паролю
              </Text>
            </div>
          </Group>
          <Group gap="xs">
            <Badge
              variant="light"
              color={profile.passwordEnabled ? "green" : "gray"}
            >
              {profile.passwordEnabled ? "Установлен" : "Не установлен"}
            </Badge>
            <Button variant="default" size="sm" onClick={onSetPassword}>
              {profile.passwordEnabled ? "Изменить" : "Создать"}
            </Button>
          </Group>
        </Group>
      </Stack>
    </Paper>
  );
}
