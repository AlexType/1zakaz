import type { Area } from "react-easy-crop";

export function readImageFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Could not read image"));
    reader.readAsDataURL(file);
  });
}

export async function cropAvatar(sourceUrl: string, area: Area): Promise<File> {
  const image = await new Promise<HTMLImageElement>((resolve, reject) => {
    const element = new Image();
    element.crossOrigin = "anonymous";
    element.onload = () => resolve(element);
    element.onerror = () => reject(new Error("Could not load image"));
    element.src = sourceUrl;
  });
  const canvas = document.createElement("canvas");
  const outputSize = Math.min(
    512,
    Math.round(area.width),
    Math.round(area.height),
  );
  if (outputSize < 1) throw new Error("Empty crop");
  canvas.width = outputSize;
  canvas.height = outputSize;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Canvas is unavailable");
  context.drawImage(
    image,
    area.x,
    area.y,
    area.width,
    area.height,
    0,
    0,
    outputSize,
    outputSize,
  );
  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (result) =>
        result ? resolve(result) : reject(new Error("Could not export image")),
      "image/webp",
      0.9,
    );
  });
  const extension = blob.type === "image/webp" ? "webp" : "png";
  return new File([blob], `avatar.${extension}`, { type: blob.type });
}
