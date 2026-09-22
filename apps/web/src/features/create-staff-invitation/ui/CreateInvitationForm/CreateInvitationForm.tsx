"use client";

import {
  Alert,
  Button,
  CopyButton,
  Paper,
  Select,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { IconCheck, IconCopy } from "@tabler/icons-react";
import { useCreateInvitation } from "../../lib/use-create-invitation";
import type { CreateInvitation, InviteRole } from "../../model/contracts";
import { INVITATION_LIFETIME_OPTIONS } from "../../model/invitation-lifetime-options";
import { formatDateTime } from "@/shared/lib/format-date-time";
import { FormError } from "@/shared/ui/FormError";

type CreateInvitationFormProps = {
  availableRoles: InviteRole[];
  onCreate: CreateInvitation;
};

export function CreateInvitationForm({
  availableRoles,
  onCreate,
}: CreateInvitationFormProps) {
  const {
    roleId,
    setRoleId,
    lifetime,
    setLifetime,
    busy,
    error,
    invitation,
    submit,
  } = useCreateInvitation(availableRoles, onCreate);

  return (
    <Paper component="section" withBorder radius="lg" p="xl" maw={540}>
      <Stack gap="lg">
        <div>
          <Title order={2} size="h3">
            Пригласить сотрудника
          </Title>
          <Text c="dimmed" size="sm" mt="xs">
            Выберите роль и срок действия. Ссылка сработает только один раз.
          </Text>
        </div>
        <FormError message={error} />
        <form onSubmit={(event) => void submit(event)}>
          <Stack gap="md">
            <Select
              label="Роль нового сотрудника"
              description="Доступные роли определяет система по вашим правам."
              placeholder="Выберите роль"
              data={availableRoles}
              value={roleId}
              onChange={setRoleId}
              required
              disabled={busy}
              searchable={false}
            />
            <Select
              label="Срок действия"
              placeholder="Выберите срок"
              data={INVITATION_LIFETIME_OPTIONS}
              value={lifetime}
              onChange={(value) => value && setLifetime(value)}
              allowDeselect={false}
              disabled={busy}
            />
            <Button type="submit" loading={busy}>
              Создать ссылку
            </Button>
          </Stack>
        </form>
        {invitation && (
          <Alert
            color="teal"
            icon={<IconCheck size={18} />}
            title="Приглашение создано"
          >
            <Stack gap="sm" mt="xs">
              <Text size="sm">
                Ссылка действует до {formatDateTime(invitation.expiresAt)}.
              </Text>
              <TextInput
                label="Ссылка для сотрудника"
                placeholder="Ссылка появится после создания"
                value={invitation.url}
                readOnly
              />
              <CopyButton value={invitation.url} timeout={2000}>
                {({ copied, copy }) => (
                  <Button
                    variant="light"
                    w="fit-content"
                    leftSection={
                      copied ? <IconCheck size={16} /> : <IconCopy size={16} />
                    }
                    onClick={copy}
                  >
                    {copied ? "Скопировано" : "Скопировать ссылку"}
                  </Button>
                )}
              </CopyButton>
              <Text size="xs" c="dimmed">
                Передайте ссылку только тому сотруднику, для которого она
                создана.
              </Text>
            </Stack>
          </Alert>
        )}
      </Stack>
    </Paper>
  );
}
