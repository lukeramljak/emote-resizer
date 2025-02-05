import { PostHogProvider } from "@/app/providers";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Twitch Emote Resizer",
  description:
    "Convert images and GIFs to use for your Twitch channel, totally free",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <PostHogProvider>
        <body
          className={`${inter.className} bg-background text-foreground antialiased`}
        >
          {children}
        </body>
      </PostHogProvider>
    </html>
  );
}
