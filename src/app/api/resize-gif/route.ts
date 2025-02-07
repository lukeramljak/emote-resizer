import type { FileUploaderResult } from "@/hooks/use-file-uploader";
import type { ResizedImage } from "@/lib/img-utils";
import { type NextRequest, NextResponse } from "next/server";
import sharp from "sharp";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const base64String = formData.get("file") as string;
    const metadata = JSON.parse(
      formData.get("metadata") as string,
    ) as FileUploaderResult["imageMetadata"];
    const cleanedBase64 = base64String.replace(
      /^data:image\/(png|gif|jpeg);base64,/,
      "",
    );

    const buffer = Buffer.from(cleanedBase64, "base64");

    const sizes = [112, 56, 28];

    const resizedImages: ResizedImage[] = [];

    for (const size of sizes) {
      const resizedGif = await sharp(buffer, { animated: true })
        .resize({ width: size, height: size })
        .toBuffer();

      const fileSize = (Buffer.byteLength(resizedGif) / 1024).toFixed(2); // File size in KB

      const base64WithPrefix = `data:image/gif;base64,${resizedGif.toString("base64")}`;

      resizedImages.push({
        content: base64WithPrefix,
        fileSize,
        metadata: {
          width: size,
          height: size,
          name: metadata?.name ?? "animated",
        },
        type: "gif",
      });
    }

    return NextResponse.json(resizedImages, {
      status: 200,
    });
  } catch {
    return NextResponse.json(
      { error: "Error resizing GIF" },
      {
        status: 500,
      },
    );
  }
}
