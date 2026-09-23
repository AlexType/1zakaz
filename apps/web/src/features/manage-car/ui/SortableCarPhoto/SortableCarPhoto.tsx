import { useSortable } from "@dnd-kit/react/sortable";
import {
  ActionIcon,
  Group,
  Paper,
  Text,
  Tooltip,
  UnstyledButton,
} from "@mantine/core";
import {
  IconGripVertical,
  IconStarFilled,
  IconTrash,
} from "@tabler/icons-react";
import { formatFileSize } from "@/shared/lib/format-file-size";
import { formatImageType } from "@/shared/lib/format-image-type";
import { PhotoPreview } from "@/shared/ui/PhotoPreview";
import type { CarPhoto } from "../../model/car-form";
import classes from "./SortableCarPhoto.module.css";

type SortableCarPhotoProps = {
  photo: CarPhoto;
  index: number;
  cover: boolean;
  onOpen: () => void;
  onRemove: () => void;
};

export function SortableCarPhoto({
  photo,
  index,
  cover,
  onOpen,
  onRemove,
}: SortableCarPhotoProps) {
  const { ref, handleRef, isDragging } = useSortable({ id: photo.id, index });
  const format = photo.file
    ? formatImageType(photo.name, photo.mimeType)
    : null;
  const details = [
    format,
    photo.sizeBytes === undefined ? null : formatFileSize(photo.sizeBytes),
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <Paper
      ref={ref}
      withBorder
      radius="md"
      className={classes.photo}
      data-dragging={isDragging || undefined}
    >
      <UnstyledButton
        className={classes.previewButton}
        aria-label={`Открыть фото ${photo.name}`}
        onClick={onOpen}
      >
        <PhotoPreview
          src={photo.url}
          alt={photo.name}
          className={classes.preview}
        />
      </UnstyledButton>
      {cover && (
        <Tooltip label="Обложка — первое фото" withArrow>
          <span className={classes.coverMark} aria-label="Обложка">
            <IconStarFilled size={17} />
          </span>
        </Tooltip>
      )}
      <Group className={classes.actions} gap={4} wrap="nowrap">
        <Tooltip label="Изменить порядок" withArrow>
          <ActionIcon
            ref={handleRef}
            variant="filled"
            color="dark"
            aria-label={`Перетащить ${photo.name}`}
            className={classes.handle}
          >
            <IconGripVertical size={18} />
          </ActionIcon>
        </Tooltip>
        <Tooltip label="Удалить фото" withArrow>
          <ActionIcon
            variant="filled"
            color="dark"
            aria-label={`Удалить ${photo.name}`}
            onClick={onRemove}
          >
            <IconTrash size={17} />
          </ActionIcon>
        </Tooltip>
      </Group>
      <div className={classes.info}>
        <Text size="sm" fw={600} truncate title={photo.name}>
          {photo.name}
        </Text>
        {details && (
          <Text size="xs" className={classes.details}>
            {details}
          </Text>
        )}
      </div>
    </Paper>
  );
}
