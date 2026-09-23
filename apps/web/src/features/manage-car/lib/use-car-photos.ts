import { useState } from "react";
import type { CarPhoto } from "../model/car-form";

function readPhoto(file: File): Promise<CarPhoto> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () =>
      resolve({
        id: crypto.randomUUID(),
        url: String(reader.result),
        name: file.name,
        file,
        sizeBytes: file.size,
        mimeType: file.type,
      });
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

export function useCarPhotos(initialPhotos: CarPhoto[]) {
  const [photos, setPhotos] = useState(initialPhotos);

  async function addFiles(files: File[]) {
    const next = await Promise.all(
      files.filter((file) => file.type.startsWith("image/")).map(readPhoto),
    );
    setPhotos((current) => [...current, ...next]);
  }

  function movePhoto(from: number, to: number) {
    setPhotos((current) => {
      if (to < 0 || to >= current.length) return current;
      const next = [...current];
      const [photo] = next.splice(from, 1);
      next.splice(to, 0, photo);
      return next;
    });
  }

  function removePhoto(id: string) {
    setPhotos((current) => current.filter((photo) => photo.id !== id));
  }

  return { photos, addFiles, movePhoto, removePhoto };
}
