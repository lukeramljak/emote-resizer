"use client";

import { Button } from "@/components/button";
import { FileDropzone } from "@/components/shared/file-dropzone";
import { ImageContainer } from "@/components/shared/image";
import { TwitchPreview } from "@/components/shared/twitch-preview";
import { UploadBox } from "@/components/shared/upload-box";
import { FileUploaderResult, useFileUploader } from "@/hooks/use-file-uploader";
import { downloadAllImages, ResizedImage } from "@/lib/img-utils";
import { convertImageToMultipleSizes } from "@/lib/static-utils";
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
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const convertImages = async () => {
      setIsLoading(true);

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

      setIsLoading(false);
    };

    convertImages();
  }, [imageMetadata, imageContent]);

  const handleNewImage = () => {
    fileUploaderProps.cancel();
    setConvertedEmotes([]);
  };

  const handleDownloadAllImages = async () => {
    await downloadAllImages([...convertedEmotes, ...convertedBadges]);
  };

  if (!imageMetadata)
    return (
      <UploadBox
        title="Convert an image to multiple sizes"
        description="Upload image"
        accept={"image/*"}
        onChange={handleFileUploadEvent}
      />
    );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center">
        <span>Loading...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-center gap-4">
        {convertedEmotes.length > 0 && convertedBadges.length > 0 && (
          <>
            <span className="font-bold">Preview</span>
            <TwitchPreview
              badge={convertedBadges[0]}
              emote={convertedEmotes[0]}
            />
            <div className="flex flex-col gap-4 w-full max-w-[800px]">
              <span className="font-bold">Emotes</span>
              <ImageContainer images={convertedEmotes} />
            </div>
            <div className="flex flex-col gap-4 w-full max-w-[800px]">
              <span className="font-bold">Badges</span>
              <ImageContainer images={convertedBadges} />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleNewImage}>New Image</Button>
              <Button onClick={handleDownloadAllImages}>Download All</Button>
            </div>
          </>
        )}
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
