import { bytesToKilobytes, ResizedImage } from "@/lib/img-utils";
import Pica from "pica";

export const convertImageToMultipleSizes = async (
  imageContent: string,
  imageMetadata: { width: number; height: number; name: string },
  sizes: number[],
): Promise<ResizedImage[]> => {
  const img = new Image();
  img.src = imageContent;

  const pica = new Pica({
    features: ["js", "wasm", "cib"],
  });

  await new Promise<void>((resolve, reject) => {
    img.onload = () => resolve();
    img.onerror = (err) => reject(err);
  });

  const resizedImages: ResizedImage[] = await Promise.all(
    sizes.map(async (size) => {
      const resizedCanvas = document.createElement("canvas");

      resizedCanvas.width = size;
      resizedCanvas.height = size;

      await pica.resize(img, resizedCanvas);

      return {
        content: resizedCanvas.toDataURL("image/png"),
        fileSize: bytesToKilobytes(estimateCanvasFileSize(resizedCanvas)),
        metadata: {
          width: size,
          height: size,
          name: imageMetadata.name,
        },
        type: "image",
      };
    }),
  );

  return resizedImages;
};

const estimateCanvasFileSize = (canvas: HTMLCanvasElement): number => {
  const imageDataHeader = "data:image/png;base64,";
  return Math.round(
    ((canvas.toDataURL("image/png").length - imageDataHeader.length) * 3) / 4,
  );
};
