export interface ResizedImage {
  content: string;
  fileSize: string;
  metadata: {
    width: number;
    height: number;
    name: string;
  };
}

export const convertImageToMultipleSizes = async (
  imageContent: string,
  imageMetadata: { width: number; height: number; name: string },
  sizes: number[],
): Promise<ResizedImage[]> => {
  const img = new Image();
  img.src = imageContent;

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("Could not get 2d context");
  }

  canvas.width = imageMetadata.width;
  canvas.height = imageMetadata.height;

  ctx.drawImage(img, 0, 0);

  const resizedImages: ResizedImage[] = await Promise.all(
    sizes.map(async (size) => {
      const resizedCanvas = document.createElement("canvas");
      const resizedCtx = resizedCanvas.getContext("2d");

      if (!resizedCtx) {
        throw new Error("Could not get 2d context for resized canvas");
      }

      resizedCanvas.width = size;
      resizedCanvas.height = size;

      resizedCtx.drawImage(
        canvas,
        0,
        0,
        imageMetadata.width,
        imageMetadata.height,
        0,
        0,
        size,
        size,
      );

      return {
        content: resizedCanvas.toDataURL("image/png"),
        fileSize: bytesToKilobytes(estimateCanvasFileSize(resizedCanvas)),
        metadata: {
          width: size,
          height: size,
          name: imageMetadata.name,
        },
      };
    }),
  );

  return resizedImages;
};

export const estimateCanvasFileSize = (canvas: HTMLCanvasElement): number => {
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("Could not get 2d context");
  }

  const imageDataHeader = "data:image/png;base64,";
  return Math.round(
    ((canvas.toDataURL("image/png").length - imageDataHeader.length) * 3) / 4,
  );
};

const bytesToKilobytes = (bytes: number): string => {
  return (bytes / 1024).toFixed(2);
};

export const downloadImage = (image: ResizedImage): void => {
  const link = document.createElement("a");
  link.href = image.content;
  link.download = `${image.metadata.name.replace(/\..+$/, "")}@${image.metadata.width}.png`;
  link.click();
};
