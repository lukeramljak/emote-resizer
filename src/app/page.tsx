import Link from "next/link";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 gap-16 sm:p-20">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
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
      <footer className="row-start-3">
        <a
          className="text-center text-sm text-gray-500 hover:underline"
          href="https://github.com/lukeramljak/emote-resizer"
          target="_blank"
          rel="noopener noreferrer"
        >
          View on GitHub
        </a>
      </footer>
    </div>
  );
}
