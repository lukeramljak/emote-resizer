import { StaticTool } from "@/app/(tools)/static/static-tool";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Static Emote - Twitch Emote Resizer",
  description:
    "Convert images and GIFs to use for your Twitch channel, totally free",
};

export default function StaticToolPage() {
  return <StaticTool />;
}
