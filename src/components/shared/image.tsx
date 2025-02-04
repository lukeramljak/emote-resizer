import { downloadImage, ResizedImage } from "@/lib/img-utils";
import Image from "next/image";

interface ImageRendererProps {
  image: ResizedImage;
}

const ImageCard = ({ image }: ImageRendererProps) => {
  return (
    <div
      className="flex flex-col justify-between border border-white/10 rounded-md cursor-pointer transition-colors bg-twitch-dark/80 hover:bg-twitch-dark"
      onClick={() => downloadImage(image)}
    >
      <div className="flex items-center justify-center h-[calc(112px+2rem)]">
        <Image
          src={image.content}
          alt={`Preview of ${image.metadata.width}x${image.metadata.height} image`}
          width={image.metadata.width}
          height={image.metadata.height}
        />
      </div>
      <div className="flex flex-col items-center justify-between rounded-b-md p-2 font-bold text-xs text-gray-200 bg-twitch-purple md:flex-row">
        <span>
          {image.metadata.width}px x {image.metadata.height}px
        </span>
        <span>{image.fileSize}KB</span>
      </div>
    </div>
  );
};

interface ImageContainerProps {
  images: ResizedImage[];
}

export const ImageContainer = ({ images }: ImageContainerProps) => {
  return (
    <div className="grid gap-4 sm:grid-cols-3 ">
      {images.map((image) => (
        <ImageCard key={image.content} image={image} />
      ))}
    </div>
  );
};
