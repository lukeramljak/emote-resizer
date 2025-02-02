import { StaticTool } from "@/app/(tools)/static/static-tool";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Static Emote | Twitch Emote Resizer",
  description: "Resize static emotes for Twitch",
};

export default function StaticToolPage() {
  return <StaticTool />;
}
