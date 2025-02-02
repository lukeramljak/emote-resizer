import { ResizedImage } from "@/lib/img-utils";
import Image from "next/image";
import { useState } from "react";

const MoonIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
  </svg>
);

const SunIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2" />
    <path d="M12 20v2" />
    <path d="m4.93 4.93 1.41 1.41" />
    <path d="m17.66 17.66 1.41 1.41" />
    <path d="M2 12h2" />
    <path d="M20 12h2" />
    <path d="m6.34 17.66-1.41 1.41" />
    <path d="m19.07 4.93-1.41 1.41" />
  </svg>
);

interface TwitchPreviewProps {
  badge?: ResizedImage;
  emote: ResizedImage;
}

export const TwitchPreview = ({ badge, emote }: TwitchPreviewProps) => {
  const [theme, setTheme] = useState<"light" | "dark">("dark");

  const bg = theme === "light" ? "bg-twitch-light" : "bg-twitch-dark";
  const text = theme === "light" ? "text-[#e1654e]" : "text-[#fb9c8a]";

  if (!emote) return null;

  return (
    <div
      className={`flex items-center justify-between h-8 w-[300px] px-3 py-5 rounded-md ${bg} transition-colors`}
    >
      <div className="flex items-center justify-start gap-2">
        {badge && (
          <Image
            src={badge.content}
            width={badge.metadata.width}
            height={badge.metadata.height}
            alt="Preview of the emote when used as a badge"
            className="h-[18px] w-[18px]"
          />
        )}
        <span className={`text-[13px] font-bold ${text}`}>lukeramljak</span>
        <Image
          src={emote.content}
          width={emote.metadata.width}
          height={emote.metadata.height}
          alt="Preview of the emote when used in a message"
          className="h-[28px] w-[28px]"
        />
      </div>
      <div className="flex">
        {theme === "dark" ? (
          <button onClick={() => setTheme("light")}>
            <MoonIcon />
          </button>
        ) : (
          <button onClick={() => setTheme("dark")} className="text-gray-900">
            <SunIcon />
          </button>
        )}
      </div>
    </div>
  );
};
