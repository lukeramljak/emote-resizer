import { BlobWriter, ZipWriter } from "@zip.js/zip.js";

export interface ResizedImage {
  content: string;
  fileSize: string;
  metadata: {
    width: number;
    height: number;
    name: string;
  };
  type: "image" | "gif";
}

export const bytesToKilobytes = (bytes: number): string => {
  return (bytes / 1024).toFixed(2);
};

export const stripFileExtension = (fileName: string): string => {
  return fileName.replace(/\..+$/, "");
};

export const generateFileName = (image: ResizedImage): string => {
  const extension = image.type === "image" ? "png" : "gif";
  return `${stripFileExtension(image.metadata.name)}@${image.metadata.width}.${extension}`;
};

export const downloadImage = (image: ResizedImage): void => {
  const link = document.createElement("a");
  link.href = image.content;
  link.download = generateFileName(image);
  link.click();
};

export const downloadAllImages = async (images: ResizedImage[]) => {
  if (!images.length) return;

  const zipWriter = new ZipWriter(new BlobWriter());

  for (const image of images) {
    const imgBlob = await fetch(image.content).then((res) => res.blob());
    const fileName = generateFileName(image);

    await zipWriter.add(fileName, imgBlob.stream());
  }

  const zipBlob = await zipWriter.close();
  const zipUrl = URL.createObjectURL(zipBlob);

  const link = document.createElement("a");
  link.href = zipUrl;
  link.download = `${stripFileExtension(images[0].metadata.name)}.zip`;
  link.click();

  URL.revokeObjectURL(zipUrl);
};
