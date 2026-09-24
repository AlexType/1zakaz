export type UploadArticleImage = (file: File) => Promise<string>;

export const mockUploadArticleImage: UploadArticleImage = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
