"use client";

import { useState } from "react";
import { DragDropProvider } from "@dnd-kit/react";
import { isSortable } from "@dnd-kit/react/sortable";
import {
  Button,
  FileButton,
  Group,
  Paper,
  SimpleGrid,
  Stack,
  Text,
} from "@mantine/core";
import { IconPhotoPlus } from "@tabler/icons-react";
import { PhotoLightbox } from "@/shared/ui/PhotoLightbox";
import type { CarPhoto } from "../../model/car-form";
import { SortableCarPhoto } from "../SortableCarPhoto";

type CarPhotoEditorProps = {
  photos: CarPhoto[];
  onAdd: (files: File[]) => void;
  onMove: (from: number, to: number) => void;
  onRemove: (id: string) => void;
};

export function CarPhotoEditor({
  photos,
  onAdd,
  onMove,
  onRemove,
}: CarPhotoEditorProps) {
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);

  return (
    <Stack gap="md">
      <Group justify="space-between" align="center">
        <div>
          <Text fw={600}>Фотографии</Text>
          <Text size="sm" c="dimmed">
            Перетащите фото за ручку, чтобы изменить порядок. Первое фото —
            обложка.
          </Text>
        </div>
        <FileButton onChange={onAdd} accept="image/*" multiple>
          {(props) => (
            <Button
              {...props}
              variant="light"
              leftSection={<IconPhotoPlus size={18} />}
            >
              Добавить фото
            </Button>
          )}
        </FileButton>
      </Group>
      {photos.length ? (
        <DragDropProvider
          onDragEnd={({ operation, canceled }) => {
            if (canceled || !isSortable(operation.source)) return;
            const { initialIndex, index } = operation.source;
            if (initialIndex !== index) onMove(initialIndex, index);
          }}
        >
          <SimpleGrid cols={{ base: 2, sm: 3, md: 4 }} spacing="sm">
            {photos.map((photo, index) => (
              <SortableCarPhoto
                key={photo.id}
                photo={photo}
                index={index}
                cover={index === 0}
                onOpen={() => setPreviewIndex(index)}
                onRemove={() => onRemove(photo.id)}
              />
            ))}
          </SimpleGrid>
        </DragDropProvider>
      ) : (
        <Paper withBorder radius="md" p="xl" ta="center">
          <Text size="sm" c="dimmed">
            Фотографий пока нет
          </Text>
        </Paper>
      )}
      <PhotoLightbox
        slides={photos.map((photo) => ({
          src: photo.url,
          alt: photo.name,
          caption: photo.name,
        }))}
        index={
          previewIndex === null || !photos.length
            ? null
            : Math.min(previewIndex, photos.length - 1)
        }
        onIndexChange={setPreviewIndex}
        onClose={() => setPreviewIndex(null)}
      />
    </Stack>
  );
}
