import { bytesToKilobytes, ResizedImage } from "@/lib/img-utils";
import { decodeFrames, encode } from "modern-gif";

export const convertGifToMultipleSizes = async (
  content: string,
  metadata: { width: number; height: number; name: string },
  sizes: number[],
): Promise<ResizedImage[]> => {
  const base64Data = content.split(",")[1]; // Removes "data:image/gif;base64,"
  const buffer = Buffer.from(base64Data, "base64");

  const frames = decodeFrames(buffer);

  const resizedGifs: ResizedImage[] = await Promise.all(
    sizes.map(async (size) => {
      const resizedFrames = frames.map((frame) => {
        const srcWidth = frame.width;
        const srcHeight = frame.height;
        const srcData = new Uint8ClampedArray(frame.data);

        const destWidth = size;
        const destHeight = size;
        const destData = new Uint8ClampedArray(destWidth * destHeight * 4);

        // Nearest-neighbor scaling
        for (let y = 0; y < destHeight; y++) {
          for (let x = 0; x < destWidth; x++) {
            const srcX = Math.floor((x / destWidth) * srcWidth);
            const srcY = Math.floor((y / destHeight) * srcHeight);
            const srcIndex = (srcY * srcWidth + srcX) * 4;
            const destIndex = (y * destWidth + x) * 4;

            destData[destIndex] = srcData[srcIndex]; // R
            destData[destIndex + 1] = srcData[srcIndex + 1]; // G
            destData[destIndex + 2] = srcData[srcIndex + 2]; // B
            destData[destIndex + 3] = srcData[srcIndex + 3]; // A (Transparency)
          }
        }

        return {
          ...frame,
          width: destWidth,
          height: destHeight,
          data: destData,
        };
      });

      const output = await encode({
        width: size,
        height: size,
        frames: resizedFrames,
      });

      const resizedGifBlob = new Blob([output], { type: "image/gif" });
      const resizedGifUrl = URL.createObjectURL(resizedGifBlob);

      return {
        content: resizedGifUrl,
        metadata: { ...metadata, width: size, height: size },
        fileSize: bytesToKilobytes(resizedGifBlob.size),
        type: "gif",
      };
    }),
  );

  return resizedGifs;
};
