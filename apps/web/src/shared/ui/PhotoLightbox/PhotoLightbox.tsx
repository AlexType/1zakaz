import { Lightbox } from "@mantine/lightbox";

const labels = {
  lightboxLabel: "Фотографии",
  slideLabel: (index: number, total: number) => `Фото ${index} из ${total}`,
  slidesLabel: "Галерея фотографий",
  previousSlideLabel: "Предыдущее фото",
  nextSlideLabel: "Следующее фото",
  thumbnailLabel: (index: number, total: number) =>
    `Открыть фото ${index} из ${total}`,
  enterFullscreenLabel: "На весь экран",
  exitFullscreenLabel: "Выйти из полноэкранного режима",
  showThumbnailsLabel: "Показать миниатюры",
  hideThumbnailsLabel: "Скрыть миниатюры",
  closeLabel: "Закрыть галерею",
};

export type PreviewSlide = { src: string; alt: string; caption?: string };

type PhotoLightboxProps = {
  slides: PreviewSlide[];
  index: number | null;
  onIndexChange: (index: number) => void;
  onClose: () => void;
};

export function PhotoLightbox({
  slides,
  index,
  onIndexChange,
  onClose,
}: PhotoLightboxProps) {
  return (
    <Lightbox
      opened={index !== null && slides.length > 0}
      onClose={onClose}
      slides={slides}
      currentIndex={index ?? 0}
      onIndexChange={onIndexChange}
      withZoom
      withThumbnails
      withFullscreen
      labels={labels}
    />
  );
}
