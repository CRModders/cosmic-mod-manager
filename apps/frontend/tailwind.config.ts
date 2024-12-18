import type { Config } from "tailwindcss";
import DefaultConfig from "./../../packages/components/tailwind.config";

export default {
    ...DefaultConfig,
    content: [
        "./app/**/*.{ts,tsx}",
        "./app/**/*.css",
        "./../../packages/components/src/**/*.{ts,tsx}",
        "./../../packages/components/src/**/*.css",
    ],
} satisfies Config;
