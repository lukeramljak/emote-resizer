"use client";

import { FileDropzone } from "@/components/shared/file-dropzone";
import { ImageContainer } from "@/components/shared/image";
import { UploadBox } from "@/components/shared/upload-box";
import { FileUploaderResult, useFileUploader } from "@/hooks/use-file-uploader";
import { convertImageToMultipleSizes, ResizedImage } from "@/lib/img-utils";
import { useEffect, useState } from "react";

const StaticToolCore = ({
  fileUploaderProps,
}: {
  fileUploaderProps: FileUploaderResult;
}) => {
  const { imageMetadata, imageContent, handleFileUploadEvent } =
    fileUploaderProps;
  const [convertedEmotes, setConvertedEmotes] = useState<ResizedImage[]>([]);
  const [convertedBadges, setConvertedBadges] = useState<ResizedImage[]>([]);

  useEffect(() => {
    const convertImages = async () => {
      if (imageMetadata && imageContent) {
        const emotes = await convertImageToMultipleSizes(
          imageContent,
          imageMetadata,
          [112, 56, 28],
        );
        setConvertedEmotes(emotes);

        const badges = await convertImageToMultipleSizes(
          imageContent,
          imageMetadata,
          [72, 36, 18],
        );
        setConvertedBadges(badges);
      }
    };

    convertImages();
  }, [imageMetadata, imageContent]);

  if (!imageMetadata)
    return (
      <UploadBox
        title="Convert an image to multiple sizes"
        description="Upload image"
        accept={"image/*"}
        onChange={handleFileUploadEvent}
      />
    );

  return (
    <div className="flex flex-col gap-6 items-center">
      <div className="flex flex-col gap-4 w-full max-w-[800px]">
        <span className="font-bold">Emotes</span>
        <ImageContainer images={convertedEmotes} />
      </div>
      <div className="flex flex-col gap-4 w-full max-w-[800px]">
        <span className="font-bold">Badges</span>
        <ImageContainer images={convertedBadges} />
      </div>
    </div>
  );
};

export const StaticTool = () => {
  const fileUploaderProps = useFileUploader();

  return (
    <FileDropzone
      setCurrentFile={fileUploaderProps.handleFileUpload}
      acceptedFileTypes={["image/*", ".jpg", ".jpeg", ".png", ".webp", ".svg"]}
      dropText="Drop image file"
    >
      <StaticToolCore fileUploaderProps={fileUploaderProps} />
    </FileDropzone>
  );
};
