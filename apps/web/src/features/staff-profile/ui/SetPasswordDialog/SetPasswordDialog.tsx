"use client";

import { useState, type SubmitEvent } from "react";
import {
  Alert,
  Button,
  Group,
  Modal,
  PasswordInput,
  Stack,
  Text,
} from "@mantine/core";
import { showActionError } from "@/shared/lib/show-action-notification";
import type { StaffProfileActions } from "../../model/contracts";

type SetPasswordDialogProps = {
  opened: boolean;
  hasPassword: boolean;
  onClose: () => void;
  onSaved: () => void;
  onSetPassword: StaffProfileActions["setPassword"];
};

export function SetPasswordDialog({
  opened,
  hasPassword,
  onClose,
  onSaved,
  onSetPassword,
}: SetPasswordDialogProps) {
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  function close() {
    if (busy) return;
    reset();
    onClose();
  }

  function reset() {
    setPassword("");
    setConfirmation("");
    setError(null);
  }

  async function submit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (password.length < 12) {
      setError("Пароль должен содержать не менее 12 символов.");
      return;
    }
    if (password !== confirmation) {
      setError("Пароли не совпадают.");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      await onSetPassword(password);
      reset();
      onSaved();
      onClose();
    } catch {
      showActionError("Не удалось сохранить пароль. Попробуйте ещё раз.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Modal
      opened={opened}
      onClose={close}
      title={hasPassword ? "Изменить пароль" : "Создать пароль"}
      centered
      closeOnClickOutside={!busy}
    >
      <form onSubmit={(event) => void submit(event)} noValidate>
        <Stack gap="md">
          <Text size="sm" c="dimmed">
            Для изменения способа входа сервер запросит повторное подтверждение
            личности.
          </Text>
          {error && (
            <Alert color="red" role="alert">
              {error}
            </Alert>
          )}
          <PasswordInput
            label="Новый пароль"
            placeholder="Не менее 12 символов"
            autoComplete="new-password"
            value={password}
            onChange={(event) => setPassword(event.currentTarget.value)}
            disabled={busy}
            required
          />
          <PasswordInput
            label="Повторите пароль"
            placeholder="Введите пароль ещё раз"
            autoComplete="new-password"
            value={confirmation}
            onChange={(event) => setConfirmation(event.currentTarget.value)}
            disabled={busy}
            required
          />
          <Group justify="flex-end">
            <Button variant="default" onClick={close} disabled={busy}>
              Отмена
            </Button>
            <Button type="submit" loading={busy}>
              Сохранить пароль
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
}
