import { useState, type SubmitEvent } from "react";
import { showActionError } from "@/shared/lib/show-action-notification";
import type {
  CreateInvitation,
  CreatedInvitation,
  InviteRole,
} from "../model/contracts";
import {
  DEFAULT_INVITATION_LIFETIME,
  INVITATION_LIFETIME_OPTIONS,
} from "../model/invitation-lifetime-options";

export function useCreateInvitation(
  availableRoles: InviteRole[],
  onCreate: CreateInvitation,
) {
  const [roleId, setRoleId] = useState<string | null>(null);
  const [lifetime, setLifetime] = useState<string>(DEFAULT_INVITATION_LIFETIME);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [invitation, setInvitation] = useState<CreatedInvitation | null>(null);

  async function submit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!roleId || !availableRoles.some((role) => role.value === roleId)) {
      setError("Выберите роль из доступного списка.");
      return;
    }
    if (
      !INVITATION_LIFETIME_OPTIONS.some((option) => option.value === lifetime)
    ) {
      setError("Выберите срок действия из списка.");
      return;
    }
    setBusy(true);
    setError(null);
    setInvitation(null);
    try {
      setInvitation(await onCreate(roleId, Number(lifetime)));
    } catch {
      showActionError("Не удалось создать приглашение. Попробуйте позже.");
    } finally {
      setBusy(false);
    }
  }

  return {
    roleId,
    setRoleId,
    lifetime,
    setLifetime,
    busy,
    error,
    invitation,
    submit,
  };
}
