import { Image } from "@mantine/core";
import classes from "./PhotoPreview.module.css";

type PhotoPreviewProps = { src: string; alt: string; className?: string };

export function PhotoPreview({ src, alt, className }: PhotoPreviewProps) {
  return (
    <span className={`${classes.frame} ${className ?? ""}`}>
      <Image src={src} alt="" aria-hidden className={classes.backdrop} />
      <Image src={src} alt={alt} className={classes.foreground} />
    </span>
  );
}
