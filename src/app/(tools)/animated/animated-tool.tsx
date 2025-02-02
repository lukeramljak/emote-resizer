"use client";

import { Button } from "@/components/button";
import { FileDropzone } from "@/components/shared/file-dropzone";
import { ImageContainer } from "@/components/shared/image";
import { TwitchPreview } from "@/components/shared/twitch-preview";
import { UploadBox } from "@/components/shared/upload-box";
import { FileUploaderResult, useFileUploader } from "@/hooks/use-file-uploader";
import { convertGifToMultipleSizes } from "@/lib/animated-utils";
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

  useEffect(() => {
    const convertImages = async () => {
      if (imageMetadata && rawContent) {
        const emotes = await convertGifToMultipleSizes(
          rawContent,
          imageMetadata,
          [112, 56, 28],
        );
        setConvertedEmotes(emotes);
      }
    };

    convertImages();
  }, [imageMetadata, rawContent]);

  const handleClear = () => {
    fileUploaderProps.cancel();
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

  return (
    <div className="flex flex-col gap-6 items-center">
      <div className="flex flex-col gap-4">
        <span className="font-bold">Preview</span>
        <TwitchPreview key={rawContent} emote={convertedEmotes[0]} />
      </div>
      <div className="flex flex-col gap-4 w-full max-w-[800px]">
        <span className="font-bold">Emotes</span>
        <ImageContainer images={convertedEmotes} />
      </div>
      <div className="flex gap-2">
        <Button onClick={handleClear}>Clear</Button>
        <Button onClick={handleDownloadAllImages}>Download All</Button>
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
