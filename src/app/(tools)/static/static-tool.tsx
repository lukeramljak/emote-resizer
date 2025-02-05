"use client";
import { Button } from "@/components/button";
import { FileDropzone } from "@/components/shared/file-dropzone";
import { ImageContainer } from "@/components/shared/image";
import { Loader } from "@/components/shared/loader";
import { TwitchPreview } from "@/components/shared/twitch-preview";
import { UploadBox } from "@/components/shared/upload-box";
import { FileUploaderResult, useFileUploader } from "@/hooks/use-file-uploader";
import { downloadAllImages, ResizedImage } from "@/lib/img-utils";
import { convertImageToMultipleSizes } from "@/lib/static-utils";
import { usePostHog } from "posthog-js/react";
import { useCallback, useEffect, useState } from "react";

const useImageConverter = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [convertedEmotes, setConvertedEmotes] = useState<ResizedImage[]>([]);
  const [convertedBadges, setConvertedBadges] = useState<ResizedImage[]>([]);

  const convertImages = useCallback(
    async (
      imageContent: string,
      imageMetadata: FileUploaderResult["imageMetadata"],
    ): Promise<boolean> => {
      setIsLoading(true);
      setError(null);

      try {
        const [emotes, badges] = await Promise.all([
          convertImageToMultipleSizes(
            imageContent,
            imageMetadata,
            [112, 56, 28],
          ),
          convertImageToMultipleSizes(
            imageContent,
            imageMetadata,
            [72, 36, 18],
          ),
        ]);

        setConvertedEmotes(emotes);
        setConvertedBadges(badges);
        return true;
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to convert images. Please try again",
        );
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  const reset = useCallback(() => {
    setConvertedEmotes([]);
    setConvertedBadges([]);
    setError(null);
  }, []);

  return {
    isLoading,
    error,
    convertedEmotes,
    convertedBadges,
    convertImages,
    reset,
  };
};

const StaticToolCore = ({
  fileUploaderProps,
}: {
  fileUploaderProps: FileUploaderResult;
}) => {
  const { imageMetadata, imageContent, handleFileUploadEvent, cancel } =
    fileUploaderProps;
  const {
    isLoading,
    error,
    convertedEmotes,
    convertedBadges,
    convertImages,
    reset,
  } = useImageConverter();
  const posthog = usePostHog();

  const processFile = useCallback(async () => {
    if (!imageMetadata || !imageContent) return;

    const success = await convertImages(imageContent, imageMetadata);
    if (!success) {
      cancel();
    }
  }, [imageMetadata, imageContent, convertImages, cancel]);

  useEffect(() => {
    if (imageMetadata && imageContent) {
      processFile();
    }
  }, [imageMetadata, imageContent, processFile]);

  const handleNewImage = useCallback(() => {
    cancel();
    reset();
  }, [cancel, reset]);

  const handleDownloadAllImages = useCallback(async () => {
    await downloadAllImages([...convertedEmotes, ...convertedBadges]);
    posthog.capture("static-download-all");
  }, [convertedEmotes, convertedBadges]);

  if (!imageMetadata) {
    return (
      <UploadBox
        title="Convert an image to multiple sizes"
        description="Upload image"
        accept="image/*"
        onChange={handleFileUploadEvent}
      />
    );
  }

  if (isLoading) {
    return <Loader message="Processing your image..." />;
  }

  if (error) {
    alert(error);
    handleNewImage();
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-center gap-4">
        {convertedEmotes.length > 0 && convertedBadges.length > 0 && (
          <>
            <span className="font-bold">Preview</span>
            <TwitchPreview
              badge={convertedBadges[2]}
              emote={convertedEmotes[2]}
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
