export const Footer = ({ className }: { className?: string }) => {
  return (
    <footer className={`mt-8 text-center text-sm text-gray-500 ${className}`}>
      <a
        className="hover:underline"
        href="https://github.com/lukeramljak/emote-resizer"
        target="_blank"
        rel="noopener noreferrer"
      >
        View on GitHub
      </a>
    </footer>
  );
};
