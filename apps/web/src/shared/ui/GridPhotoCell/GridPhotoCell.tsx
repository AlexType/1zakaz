import { UnstyledButton } from "@mantine/core";
import { IconZoomIn } from "@tabler/icons-react";
import { PhotoPreview } from "@/shared/ui/PhotoPreview";
import classes from "./GridPhotoCell.module.css";

type Props = {
  src: string | null;
  alt: string;
  openLabel: string;
  onPreview?: () => void;
};

export function GridPhotoCell({ src, alt, openLabel, onPreview }: Props) {
  return (
    <div className={classes.frame}>
      {src ? (
        <UnstyledButton
          className={classes.button}
          aria-label={openLabel}
          onClick={onPreview}
        >
          <PhotoPreview src={src} alt={alt} />
          <span className={classes.previewHint} aria-hidden="true">
            <IconZoomIn size={22} stroke={1.8} />
          </span>
        </UnstyledButton>
      ) : (
        <div className={classes.empty}>Нет фото</div>
      )}
    </div>
  );
}
