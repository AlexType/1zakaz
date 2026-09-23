"use client";

import { useRef, useState } from "react";
import {
  ActionIcon,
  Avatar,
  FileButton,
  Tooltip,
  UnstyledButton,
} from "@mantine/core";
import { IconCamera, IconPencil, IconTrash } from "@tabler/icons-react";
import type { Area } from "react-easy-crop";
import { showActionError } from "@/shared/lib/show-action-notification";
import { cropAvatar, readImageFile } from "../../lib/crop-avatar";
import type { AvatarChange } from "../../model/contracts";
import { AvatarCropDialog } from "../AvatarCropDialog";
import classes from "./ProfileAvatar.module.css";

const MAX_AVATAR_SIZE = 5 * 1024 * 1024;
const AVATAR_TYPES = ["image/jpeg", "image/png", "image/webp"];

type PendingCrop = { sourceUrl: string; originalFile: File | null };

type ProfileAvatarProps = {
  src: string | null;
  sourceUrl: string | null;
  initials: string;
  onChange: (change: AvatarChange) => Promise<void>;
};

export function ProfileAvatar({
  src,
  sourceUrl,
  initials,
  onChange,
}: ProfileAvatarProps) {
  const resetRef = useRef<() => void>(null);
  const [pending, setPending] = useState<PendingCrop | null>(null);
  const [busy, setBusy] = useState(false);

  async function choose(file: File | null) {
    if (!file) return;
    if (!AVATAR_TYPES.includes(file.type) || file.size > MAX_AVATAR_SIZE) {
      showActionError("Выберите JPG, PNG или WebP размером до 5 МБ.");
      resetRef.current?.();
      return;
    }
    try {
      setPending({ sourceUrl: await readImageFile(file), originalFile: file });
    } catch {
      showActionError("Не удалось открыть фото. Выберите другой файл.");
    } finally {
      resetRef.current?.();
    }
  }

  async function saveCrop(area: Area) {
    if (!pending) return;
    setBusy(true);
    try {
      const file = await cropAvatar(pending.sourceUrl, area);
      const previewUrl = await readImageFile(file);
      await onChange({
        file,
        originalFile: pending.originalFile,
        previewUrl,
        sourceUrl: pending.sourceUrl,
      });
      setPending(null);
    } catch {
      showActionError(
        "Не удалось сохранить фото. Попробуйте другое изображение.",
      );
    } finally {
      setBusy(false);
    }
  }

  async function remove() {
    setBusy(true);
    try {
      await onChange({
        file: null,
        originalFile: null,
        previewUrl: null,
        sourceUrl: null,
      });
    } catch {
      showActionError("Не удалось удалить фото. Попробуйте ещё раз.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className={classes.wrap}>
      <div className={classes.avatarBox}>
        <FileButton
          onChange={(file) => void choose(file)}
          accept={AVATAR_TYPES.join(",")}
          resetRef={resetRef}
        >
          {(props) => (
            <UnstyledButton
              {...props}
              className={classes.upload}
              aria-label={
                src ? "Заменить фото профиля" : "Загрузить фото профиля"
              }
              disabled={busy}
            >
              <span className={classes.visual}>
                <Avatar src={src} size={104} radius="xl" color="red">
                  {initials}
                </Avatar>
                <span className={classes.overlay} aria-hidden="true">
                  {src ? "Заменить" : "Загрузить"}
                </span>
              </span>
              <span className={classes.cameraMark} aria-hidden="true">
                <IconCamera size={16} />
              </span>
            </UnstyledButton>
          )}
        </FileButton>
        {src && (
          <>
            <Tooltip label="Изменить кадрирование" withArrow>
              <ActionIcon
                className={classes.edit}
                variant="filled"
                color="dark"
                radius="xl"
                size="sm"
                aria-label="Изменить кадрирование фото"
                onClick={() => {
                  setPending({
                    sourceUrl: sourceUrl ?? src,
                    originalFile: null,
                  });
                }}
                disabled={busy}
              >
                <IconPencil size={14} />
              </ActionIcon>
            </Tooltip>
            <Tooltip label="Удалить фото" withArrow>
              <ActionIcon
                className={classes.remove}
                variant="filled"
                color="dark"
                radius="xl"
                size="sm"
                aria-label="Удалить фото профиля"
                onClick={() => void remove()}
                disabled={busy}
              >
                <IconTrash size={14} />
              </ActionIcon>
            </Tooltip>
          </>
        )}
      </div>
      {pending && (
        <AvatarCropDialog
          sourceUrl={pending.sourceUrl}
          busy={busy}
          onClose={() => setPending(null)}
          onSave={saveCrop}
        />
      )}
    </div>
  );
}
