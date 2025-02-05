import { Analytics } from "@vercel/analytics/react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CSPostHogProvider } from "./providers";

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
      <CSPostHogProvider>
        <body>{children}</body>
        <body
          className={`${inter.className} bg-background text-foreground antialiased`}
        >
          {children}
          <Analytics />
        </body>
      </CSPostHogProvider>
    </html>
  );
}
