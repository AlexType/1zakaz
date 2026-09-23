import { Button, Group, Modal, Stack, Text } from "@mantine/core";

type UnsavedChangesModalProps = {
  opened: boolean;
  onClose: () => void;
  onDiscard: () => void;
};

export function UnsavedChangesModal({
  opened,
  onClose,
  onDiscard,
}: UnsavedChangesModalProps) {
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Есть несохранённые изменения"
      centered
    >
      <Stack gap="lg">
        <Text size="sm">
          Если выйти сейчас, изменения в форме будут потеряны.
        </Text>
        <Group justify="flex-end">
          <Button variant="default" onClick={onClose}>
            Продолжить редактирование
          </Button>
          <Button color="red" onClick={onDiscard}>
            Выйти без сохранения
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}
