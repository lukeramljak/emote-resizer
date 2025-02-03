import { AnimatedTool } from "@/app/(tools)/animated/animated-tool";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Animated Emote - Twitch Emote Resizer",
  description:
    "Convert images and GIFs to use for your Twitch channel, totally free",
};

export default function AnimatedToolPage() {
  return <AnimatedTool />;
}
