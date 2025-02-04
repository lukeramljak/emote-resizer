"use client";

import { Button } from "@/components/button";
import { FileDropzone } from "@/components/shared/file-dropzone";
import { ImageContainer } from "@/components/shared/image";
import { TwitchPreview } from "@/components/shared/twitch-preview";
import { UploadBox } from "@/components/shared/upload-box";
import { FileUploaderResult, useFileUploader } from "@/hooks/use-file-uploader";
import { downloadAllImages, ResizedImage } from "@/lib/img-utils";
import { useEffect, useState } from "react";

const AnimatedToolCore = ({
  fileUploaderProps,
}: {
  fileUploaderProps: FileUploaderResult;
}) => {
  const { imageMetadata, rawContent, handleFileUploadEvent } =
    fileUploaderProps;
  const [convertedEmotes, setConvertedEmotes] = useState<ResizedImage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const resizeGifs = async (base64: string) => {
      try {
        setIsLoading(true);

        const formData = new FormData();
        formData.append("file", base64);
        formData.append("metadata", JSON.stringify(imageMetadata));

        const response = await fetch("/api/resize-gif", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          fileUploaderProps.cancel();
          throw new Error("Failed to resize GIF");
        }

        const resizedImages = await response.json();

        if (isMounted) {
          setConvertedEmotes(resizedImages);
        }
      } catch {
        alert("Failed to resize GIF. Please try again.");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    if (imageMetadata && rawContent) {
      resizeGifs(rawContent);
    }

    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imageMetadata, rawContent]);

  const handleNewImage = () => {
    fileUploaderProps.cancel();
    setConvertedEmotes([]);
  };

  const handleDownloadAllImages = async () => {
    await downloadAllImages(convertedEmotes);
  };

  if (!imageMetadata)
    return (
      <UploadBox
        title="Convert an animated GIF to multiple sizes"
        description="Upload GIF"
        accept={".gif"}
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
        {convertedEmotes.length > 0 && (
          <>
            <span className="font-bold">Preview</span>
            <TwitchPreview emote={convertedEmotes[0]} />
            <div className="flex flex-col gap-4 w-full max-w-[800px]">
              <span className="font-bold">Emotes</span>
              <ImageContainer images={convertedEmotes} />
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
