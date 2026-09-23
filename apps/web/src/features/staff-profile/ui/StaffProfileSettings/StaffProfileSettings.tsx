"use client";

import { useState } from "react";
import { Stack, Title } from "@mantine/core";
import type { StaffAccount } from "@/entities/employee";
import { showActionSuccess } from "@/shared/lib/show-action-notification";
import type { StaffProfileActions } from "../../model/contracts";
import { ChangeEmailDialog } from "../ChangeEmailDialog";
import { ContactDetailsCard } from "../ContactDetailsCard";
import { PersonalDetailsCard } from "../PersonalDetailsCard";
import { SecuritySettingsCard } from "../SecuritySettingsCard";
import { SetPasswordDialog } from "../SetPasswordDialog";
import classes from "./StaffProfileSettings.module.css";

type StaffProfileSettingsProps = {
  initialProfile: StaffAccount;
  actions: StaffProfileActions;
};

export function StaffProfileSettings({
  initialProfile,
  actions,
}: StaffProfileSettingsProps) {
  const [profile, setProfile] = useState(initialProfile);
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);

  return (
    <section className={classes.page} aria-label="Профиль сотрудника">
      <Stack gap="lg">
        <Title order={1} size="h2">
          Профиль
        </Title>
        <PersonalDetailsCard
          profile={profile}
          onSave={async (values) => {
            await actions.savePersonalDetails(values);
            setProfile((current) => ({
              ...current,
              ...values,
            }));
            showActionSuccess("Личные данные сохранены.");
          }}
          onAvatarChange={async (change) => {
            await actions.updateAvatar(change.file, change.originalFile);
            setProfile((current) => ({
              ...current,
              avatarUrl: change.previewUrl,
              avatarSourceUrl: change.sourceUrl,
            }));
            showActionSuccess(
              change.file ? "Фото обновлено." : "Фото удалено.",
            );
          }}
        />
        <ContactDetailsCard
          profile={profile}
          onPhoneSave={async (phone) => {
            await actions.updatePhone(phone);
            setProfile((current) => ({ ...current, phone }));
            showActionSuccess("Номер изменён.");
          }}
          onEmailEdit={() => setEmailDialogOpen(true)}
        />
        <SecuritySettingsCard
          profile={profile}
          onSetPassword={() => setPasswordDialogOpen(true)}
        />
      </Stack>
      <ChangeEmailDialog
        opened={emailDialogOpen}
        currentEmail={profile.email}
        onClose={() => setEmailDialogOpen(false)}
        onRequest={actions.requestEmailChange}
        onConfirm={actions.confirmEmailChange}
        onChanged={(email) => {
          setProfile((current) => ({ ...current, email }));
          showActionSuccess("Новая почта подтверждена.");
        }}
      />
      <SetPasswordDialog
        opened={passwordDialogOpen}
        hasPassword={profile.passwordEnabled}
        onClose={() => setPasswordDialogOpen(false)}
        onSetPassword={actions.setPassword}
        onSaved={() => {
          setProfile((current) => ({ ...current, passwordEnabled: true }));
          showActionSuccess("Пароль сохранён.");
        }}
      />
    </section>
  );
}
