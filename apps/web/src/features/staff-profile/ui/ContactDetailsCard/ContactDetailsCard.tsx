"use client";

import { useEffect, useRef, useState, type SubmitEvent } from "react";
import {
  Alert,
  Badge,
  Button,
  Divider,
  Group,
  MaskInput,
  Paper,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { IconPencil } from "@tabler/icons-react";
import type { StaffAccount } from "@/entities/employee";
import { formatRussianPhone } from "@/shared/lib/format-russian-phone";
import { normalizeRussianPhone } from "@/shared/lib/normalize-russian-phone";
import { showActionError } from "@/shared/lib/show-action-notification";
import classes from "./ContactDetailsCard.module.css";

type ContactDetailsCardProps = {
  profile: StaffAccount;
  onPhoneSave: (phone: string) => Promise<void>;
  onEmailEdit: () => void;
};

export function ContactDetailsCard({
  profile,
  onPhoneSave,
  onEmailEdit,
}: ContactDetailsCardProps) {
  const [editingPhone, setEditingPhone] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pastedPhone, setPastedPhone] = useState<string | null>(null);
  const [pasteVersion, setPasteVersion] = useState(0);
  const phoneInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (pasteVersion === 0) return;
    phoneInputRef.current?.focus();
    phoneInputRef.current?.setSelectionRange(
      phoneInputRef.current.value.length,
      phoneInputRef.current.value.length,
    );
  }, [pasteVersion]);

  async function savePhone(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = new FormData(event.currentTarget).get("phone");
    const normalized = normalizeRussianPhone(String(value ?? ""));
    if (!normalized) {
      setError("Укажите номер в формате +7 999 123-45-67.");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      await onPhoneSave(normalized);
      setPastedPhone(null);
      setEditingPhone(false);
    } catch {
      showActionError("Не удалось изменить номер. Попробуйте ещё раз.");
    } finally {
      setBusy(false);
    }
  }

  function cancel() {
    setError(null);
    setPastedPhone(null);
    setEditingPhone(false);
  }

  return (
    <Paper withBorder radius="lg" p="lg">
      <Stack gap="md">
        <Title order={2} size="h4">
          Контакты
        </Title>
        {!editingPhone ? (
          <div className={classes.row}>
            <div>
              <Text size="sm" c="dimmed">
                Номер телефона
              </Text>
              <Text fw={600}>{formatRussianPhone(profile.phone)}</Text>
            </div>
            <Button
              variant="subtle"
              size="sm"
              leftSection={<IconPencil size={16} />}
              onClick={() => setEditingPhone(true)}
            >
              Изменить
            </Button>
          </div>
        ) : (
          <form onSubmit={(event) => void savePhone(event)} noValidate>
            <Stack gap="sm">
              {error && (
                <Alert color="red" role="alert">
                  {error}
                </Alert>
              )}
              <MaskInput
                key={pasteVersion}
                ref={phoneInputRef}
                name="phone"
                label="Номер телефона"
                mask="+7 (999) 999-99-99"
                placeholder="+7 (___) ___-__-__"
                type="tel"
                autoComplete="tel"
                inputMode="numeric"
                defaultValue={formatRussianPhone(pastedPhone ?? profile.phone)}
                onPaste={(event) => {
                  const normalized = normalizeRussianPhone(
                    event.clipboardData.getData("text"),
                  );
                  if (!normalized) return;
                  event.preventDefault();
                  setPastedPhone(normalized);
                  setPasteVersion((version) => version + 1);
                }}
                disabled={busy}
                required
              />
              <Group justify="flex-end" gap="xs">
                <Button variant="default" onClick={cancel} disabled={busy}>
                  Отмена
                </Button>
                <Button type="submit" loading={busy}>
                  Сохранить
                </Button>
              </Group>
            </Stack>
          </form>
        )}
        <Divider />
        <div className={classes.row}>
          <div>
            <Text size="sm" c="dimmed">
              Электронная почта
            </Text>
            <Group gap="xs">
              <Text fw={600}>{profile.email}</Text>
              <Badge variant="light" color="green" size="sm">
                Подтверждена
              </Badge>
            </Group>
          </div>
          <Button
            variant="subtle"
            size="sm"
            leftSection={<IconPencil size={16} />}
            onClick={onEmailEdit}
          >
            Изменить
          </Button>
        </div>
      </Stack>
    </Paper>
  );
}
