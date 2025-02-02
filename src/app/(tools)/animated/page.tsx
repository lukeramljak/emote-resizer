import { AnimatedTool } from "@/app/(tools)/animated/animated-tool";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Animated Emote | Twitch Emote Resizer",
  description: "Resize animated emotes for Twitch",
};

export default function AnimatedToolPage() {
  return <AnimatedTool />;
}
