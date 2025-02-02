import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        "twitch-purple": "hsl(var(--twitch-purple))",
        "twitch-dark": "hsl(var(--twitch-dark))",
        "twitch-light": "hsl(var(--twitch-light))",
        button: "hsl(var(--button))",
      },
    },
  },
  plugins: [],
} satisfies Config;
