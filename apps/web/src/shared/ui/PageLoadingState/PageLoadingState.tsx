import { Loader, Stack, Text } from "@mantine/core";

type PageLoadingStateProps = {
  label?: string;
};

export function PageLoadingState({
  label = "Загружаем данные…",
}: PageLoadingStateProps) {
  return (
    <Stack align="center" justify="center" gap="sm" mih={240} role="status">
      <Loader size="sm" />
      <Text size="sm" c="dimmed">
        {label}
      </Text>
    </Stack>
  );
}
