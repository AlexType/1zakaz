"use client";

import { useId, useState, type SubmitEvent } from "react";
import {
  Alert,
  Button,
  Group,
  Input,
  Modal,
  PinInput,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { z } from "zod";
import { showActionError } from "@/shared/lib/show-action-notification";
import type { StaffProfileActions } from "../../model/contracts";

type ChangeEmailDialogProps = {
  opened: boolean;
  currentEmail: string;
  onClose: () => void;
  onChanged: (email: string) => void;
  onRequest: StaffProfileActions["requestEmailChange"];
  onConfirm: StaffProfileActions["confirmEmailChange"];
};

export function ChangeEmailDialog({
  opened,
  currentEmail,
  onClose,
  onChanged,
  onRequest,
  onConfirm,
}: ChangeEmailDialogProps) {
  const [email, setEmail] = useState("");
  const [challengeId, setChallengeId] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const codeId = useId();

  function close() {
    if (busy) return;
    setEmail("");
    setCode("");
    setChallengeId(null);
    setError(null);
    onClose();
  }

  async function submit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    if (!challengeId) {
      const normalized = email.trim().toLowerCase();
      if (
        !z.email().safeParse(normalized).success ||
        normalized === currentEmail.toLowerCase()
      ) {
        setError("Укажите новый корректный адрес почты.");
        return;
      }
      setBusy(true);
      try {
        const challenge = await onRequest(normalized);
        setChallengeId(challenge.challengeId);
        setEmail(normalized);
      } catch {
        showActionError("Не удалось отправить код. Попробуйте ещё раз.");
      } finally {
        setBusy(false);
      }
      return;
    }
    if (!/^\d{6}$/.test(code)) {
      setError("Введите шесть цифр из письма.");
      return;
    }
    setBusy(true);
    try {
      await onConfirm(challengeId, code);
      onChanged(email);
      closeAfterSuccess();
    } catch {
      setError(
        "Код неверный или истёк. Проверьте письмо и попробуйте ещё раз.",
      );
    } finally {
      setBusy(false);
    }
  }

  function closeAfterSuccess() {
    setEmail("");
    setCode("");
    setChallengeId(null);
    setError(null);
    onClose();
  }

  return (
    <Modal
      opened={opened}
      onClose={close}
      title="Изменить почту"
      centered
      closeOnClickOutside={!busy}
    >
      <form onSubmit={(event) => void submit(event)} noValidate>
        <Stack gap="md">
          {error && (
            <Alert color="red" role="alert">
              {error}
            </Alert>
          )}
          {!challengeId ? (
            <>
              <Text size="sm" c="dimmed">
                Текущий адрес: {currentEmail}. На новый адрес отправим код
                подтверждения.
              </Text>
              <TextInput
                label="Новая почта"
                placeholder="name@example.ru"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.currentTarget.value)}
                disabled={busy}
                required
              />
            </>
          ) : (
            <>
              <Text size="sm" c="dimmed">
                Код отправлен на {email}. Текущий адрес сохранится до
                подтверждения.
              </Text>
              <div>
                <Input.Label htmlFor={`${codeId}-1`} mb="xs">
                  Код из письма
                </Input.Label>
                <PinInput
                  id={codeId}
                  length={6}
                  type="number"
                  inputMode="numeric"
                  gap={8}
                  placeholder="–"
                  value={code}
                  onChange={setCode}
                  ariaLabel="Код из письма"
                  getInputProps={(index) => ({
                    "aria-label": `Код из письма, цифра ${index + 1} из 6`,
                  })}
                  disabled={busy}
                />
              </div>
            </>
          )}
          <Group justify="flex-end">
            <Button variant="default" onClick={close} disabled={busy}>
              Отмена
            </Button>
            <Button type="submit" loading={busy}>
              {challengeId ? "Подтвердить" : "Отправить код"}
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
}
