"use client";

import { Button } from "@/components/button";
import { FileDropzone } from "@/components/shared/file-dropzone";
import { ImageContainer } from "@/components/shared/image";
import { Loader } from "@/components/shared/loader";
import { TwitchPreview } from "@/components/shared/twitch-preview";
import { UploadBox } from "@/components/shared/upload-box";
import {
  type FileUploaderResult,
  useFileUploader,
} from "@/hooks/use-file-uploader";
import { type ResizedImage, downloadAllImages } from "@/lib/img-utils";
import { usePostHog } from "posthog-js/react";
import { useCallback, useEffect, useState } from "react";

const useResizeGif = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [convertedEmotes, setConvertedEmotes] = useState<ResizedImage[]>([]);

  const resizeGif = useCallback(
    async (
      base64: string,
      metadata: FileUploaderResult["imageMetadata"],
    ): Promise<boolean> => {
      setIsLoading(true);
      setError(null);

      try {
        const formData = new FormData();
        formData.append("file", base64);
        formData.append("metadata", JSON.stringify(metadata));

        const response = await fetch("/api/resize-gif", {
          method: "POST",
          body: formData,
        });

        const result: ResizedImage[] = await response.json();

        if (!response.ok) {
          throw new Error("Failed to resize GIF. Please try again");
        }

        setConvertedEmotes(result || []);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unexpected error occurred",
        );
        return false;
      } finally {
        setIsLoading(false);
      }

      return true;
    },
    [],
  );

  const reset = useCallback(() => {
    setConvertedEmotes([]);
    setError(null);
  }, []);

  return {
    isLoading,
    error,
    convertedEmotes,
    resizeGif,
    reset,
  };
};

const AnimatedToolCore = ({
  fileUploaderProps,
}: {
  fileUploaderProps: FileUploaderResult;
}) => {
  const { imageMetadata, rawContent, handleFileUploadEvent, cancel } =
    fileUploaderProps;
  const { isLoading, convertedEmotes, error, resizeGif, reset } =
    useResizeGif();
  const posthog = usePostHog();

  const processFile = useCallback(async () => {
    if (!imageMetadata || !rawContent) return;

    const success = await resizeGif(rawContent, imageMetadata);
    if (!success) {
      cancel();
    }
  }, [imageMetadata, rawContent, resizeGif, cancel]);

  useEffect(() => {
    if (imageMetadata && rawContent) {
      processFile();
    }
  }, [imageMetadata, rawContent, processFile]);

  const handleNewImage = useCallback(() => {
    cancel();
    reset();
  }, [cancel, reset]);

  const handleDownloadAll = async () => {
    downloadAllImages(convertedEmotes);
    posthog.capture("animated-download-all");
  };

  if (!imageMetadata) {
    return (
      <UploadBox
        title="Convert an animated GIF to multiple sizes"
        description="Upload GIF"
        accept={".gif"}
        onChange={handleFileUploadEvent}
      />
    );
  }

  if (isLoading) {
    return <Loader message="Processing your GIF..." />;
  }

  if (error) {
    alert(error);
    handleNewImage();
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-center gap-4">
        {convertedEmotes.length > 0 && (
          <>
            <span className="font-bold">Preview</span>
            <TwitchPreview emote={convertedEmotes[2]} />

            <div className="flex flex-col gap-4 w-full max-w-[800px]">
              <span className="font-bold">Emotes</span>
              <ImageContainer images={convertedEmotes} />
            </div>

            <div className="flex gap-2">
              <Button onClick={handleNewImage}>New Image</Button>
              <Button onClick={handleDownloadAll}>Download All</Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export const AnimatedTool = () => {
  const fileUploaderProps = useFileUploader();

  return (
    <FileDropzone
      setCurrentFile={fileUploaderProps.handleFileUpload}
      acceptedFileTypes={[".gif"]}
      dropText="Drop a GIF file"
    >
      <AnimatedToolCore fileUploaderProps={fileUploaderProps} />
    </FileDropzone>
  );
};
