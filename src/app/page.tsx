import { Footer } from "@/components/footer";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen p-8 sm:p-20">
      <main className="flex flex-col flex-grow gap-8 row-start-2 items-center justify-center">
        <h1 className="text-2xl font-bold">Twitch Emote Resizer</h1>
        <div className="flex flex-col items-center justify-center w-full gap-4">
          <Link href="/static" className="text-blue-500 hover:underline">
            Static Emote
          </Link>
          <Link href="/animated" className="text-blue-500 hover:underline">
            Animated Emote
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
