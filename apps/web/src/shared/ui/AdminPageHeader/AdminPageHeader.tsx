import { Group, Stack, Text, Title } from "@mantine/core";

type AdminPageHeaderProps = {
  title: string;
  description?: string;
  actions?: React.ReactNode;
};

export function AdminPageHeader({
  title,
  description,
  actions,
}: AdminPageHeaderProps) {
  return (
    <Group justify="space-between" align="flex-start" gap="md" wrap="wrap">
      <Stack gap={4}>
        <Title order={1} size="h2">
          {title}
        </Title>
        {description && (
          <Text c="dimmed" size="sm">
            {description}
          </Text>
        )}
      </Stack>
      {actions && <Group gap="sm">{actions}</Group>}
    </Group>
  );
}
