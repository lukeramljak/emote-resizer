import { ResizedImage } from "@/lib/img-utils";
import Image from "next/image";

interface ImageRendererProps {
  image: ResizedImage;
}

const ImageCard = ({ image }: ImageRendererProps) => {
  return (
    <div className="flex flex-col justify-between border border-white/30 rounded-md">
      <div className="flex items-center justify-center h-[calc(112px+2rem)]">
        <Image
          src={image.content}
          alt={`Preview of ${image.size}x${image.size} image`}
          width={image.size}
          height={image.size}
        />
      </div>
      <div className="flex flex-col items-center justify-between p-2 text-xs text-gray-200 bg-white/10 sm:flex-row">
        <span>
          {image.size}px x {image.size}px
        </span>
        <span className="font-bold">{image.fileSize}KB</span>
      </div>
    </div>
  );
};

interface ImageContainerProps {
  images: ResizedImage[];
}

export const ImageContainer = ({ images }: ImageContainerProps) => {
  return (
    <div className="grid grid-cols-3 gap-4">
      {images.map((image) => (
        <ImageCard key={image.content} image={image} />
      ))}
    </div>
  );
};
