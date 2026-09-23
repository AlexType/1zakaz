"use client";

import { useState } from "react";
import {
  Badge,
  Button,
  Group,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { schemaResolver, useForm } from "@mantine/form";
import { IconPencil } from "@tabler/icons-react";
import { z } from "zod";
import { getStaffDisplayName, type StaffAccount } from "@/entities/employee";
import { getPersonInitials } from "@/shared/lib/format-person-short-name";
import { showActionError } from "@/shared/lib/show-action-notification";
import type { AvatarChange, SavePersonalDetails } from "../../model/contracts";
import { ProfileAvatar } from "../ProfileAvatar";
import classes from "./PersonalDetailsCard.module.css";

const detailsSchema = z.object({
  lastName: z.string().trim().min(1, "Укажите фамилию"),
  firstName: z.string().trim().min(1, "Укажите имя"),
  patronymic: z.string().trim(),
});

type PersonalDetailsCardProps = {
  profile: StaffAccount;
  onSave: SavePersonalDetails;
  onAvatarChange: (change: AvatarChange) => Promise<void>;
};

export function PersonalDetailsCard({
  profile,
  onSave,
  onAvatarChange,
}: PersonalDetailsCardProps) {
  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      lastName: profile.lastName,
      firstName: profile.firstName,
      patronymic: profile.patronymic,
    },
    validate: schemaResolver(detailsSchema, { sync: true }),
  });
  const [editing, setEditing] = useState(false);
  const [busy, setBusy] = useState(false);

  async function save(values: z.infer<typeof detailsSchema>) {
    setBusy(true);
    try {
      const details = {
        lastName: values.lastName.trim(),
        firstName: values.firstName.trim(),
        patronymic: values.patronymic.trim(),
      };
      await onSave(details);
      setEditing(false);
    } catch {
      showActionError("Не удалось сохранить данные. Попробуйте ещё раз.");
    } finally {
      setBusy(false);
    }
  }

  function cancel() {
    form.setValues({
      lastName: profile.lastName,
      firstName: profile.firstName,
      patronymic: profile.patronymic,
    });
    form.clearErrors();
    setEditing(false);
  }

  const displayName = getStaffDisplayName(profile);

  return (
    <Paper withBorder radius="lg" p="lg">
      <Stack gap="lg">
        <Group
          justify="space-between"
          align="center"
          gap="sm"
          className={classes.header}
        >
          <Title order={2} size="h4">
            Личные данные
          </Title>
          {!editing && (
            <Button
              variant="subtle"
              size="sm"
              leftSection={<IconPencil size={16} />}
              onClick={() => setEditing(true)}
            >
              Изменить
            </Button>
          )}
        </Group>
        <Group
          align="center"
          gap="lg"
          wrap="nowrap"
          className={classes.identity}
        >
          <ProfileAvatar
            src={profile.avatarUrl}
            sourceUrl={profile.avatarSourceUrl}
            initials={getPersonInitials(displayName)}
            onChange={onAvatarChange}
          />
          <Stack gap={5}>
            <Text fw={700} size="lg">
              {displayName}
            </Text>
            <Badge variant="light" color="gray" size="sm">
              {profile.roleName}
            </Badge>
          </Stack>
        </Group>
        {editing && (
          <form
            onSubmit={form.onSubmit((values) => void save(values))}
            noValidate
          >
            <Stack gap="md">
              <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="md">
                <TextInput
                  key={form.key("lastName")}
                  label="Фамилия"
                  placeholder="Петрова"
                  autoComplete="family-name"
                  required
                  disabled={busy}
                  {...form.getInputProps("lastName")}
                />
                <TextInput
                  key={form.key("firstName")}
                  label="Имя"
                  placeholder="Анна"
                  autoComplete="given-name"
                  required
                  disabled={busy}
                  {...form.getInputProps("firstName")}
                />
                <TextInput
                  key={form.key("patronymic")}
                  label="Отчество"
                  placeholder="Сергеевна"
                  autoComplete="additional-name"
                  disabled={busy}
                  {...form.getInputProps("patronymic")}
                />
              </SimpleGrid>
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
      </Stack>
    </Paper>
  );
}
