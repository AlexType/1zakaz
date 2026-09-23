"use client";

import { useState } from "react";
import { Button, Group, Modal, Slider, Stack, Text } from "@mantine/core";
import Cropper, { type Area } from "react-easy-crop";
import classes from "./AvatarCropDialog.module.css";

type AvatarCropDialogProps = {
  sourceUrl: string;
  busy: boolean;
  onClose: () => void;
  onSave: (area: Area) => Promise<void>;
};

export function AvatarCropDialog({
  sourceUrl,
  busy,
  onClose,
  onSave,
}: AvatarCropDialogProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [area, setArea] = useState<Area | null>(null);

  return (
    <Modal
      opened
      onClose={onClose}
      title="Кадрировать фото"
      centered
      size="md"
      closeOnClickOutside={!busy}
      closeOnEscape={!busy}
      withCloseButton={!busy}
      transitionProps={{ transition: "fade", duration: 0 }}
    >
      <Stack gap="md">
        <div className={classes.cropArea}>
          <Cropper
            image={sourceUrl}
            crop={crop}
            zoom={zoom}
            aspect={1}
            cropShape="round"
            showGrid={false}
            objectFit="cover"
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={(_, pixels) => setArea(pixels)}
          />
        </div>
        <div>
          <Text size="sm" fw={600} mb="xs">
            Масштаб
          </Text>
          <Slider
            aria-label="Масштаб фото"
            min={1}
            max={3}
            step={0.01}
            value={zoom}
            onChange={setZoom}
            disabled={busy}
          />
        </div>
        <Group justify="flex-end">
          <Button variant="default" onClick={onClose} disabled={busy}>
            Отмена
          </Button>
          <Button
            onClick={() => area && void onSave(area)}
            disabled={!area}
            loading={busy}
          >
            Сохранить фото
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}
