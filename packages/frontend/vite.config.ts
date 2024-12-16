import { reactRouter } from "@react-router/dev/vite";
import autoprefixer from "autoprefixer";
import tailwindcss from "tailwindcss";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
    server: {
        port: 3000,
        proxy: {
            "/api": {
                target: "https://api.crmm.tech",
                changeOrigin: true,
                secure: true,
            },
        },
    },
    css: {
        postcss: {
            plugins: [tailwindcss, autoprefixer],
        },
    },
    build: {
        rollupOptions: {
            output: {
                manualChunks: (id) => {
                    // Libs
                    if (id.includes("/react")) return "react";
                    if (id.includes("/radix") || id.includes("lucide")) return "ui-lib";
                    if (id.includes("/markdown-it") || id.includes("mdurl")) return "markdown-it";
                    if (id.includes("/highlight.js")) return "highlight-js";
                    if (id.includes("/xss") || id.includes("cssfilter")) return "xss";
                    if (id.includes("/@tanstack")) return "tanstack";

                    if (id.includes("shared")) return "shared";
                    if (id.includes("types")) return "types";
                    if (id.includes("config")) return "config";
                    if (id.includes("icon")) return "icons";

                    // Components
                    if (id.includes("components/layout")) return "layout";
                    if (id.includes("components/ui")) return "ui";
                    if (id.includes("components")) return "layout";

                    if (id.includes("routes")) return "routes";

                    // Pages
                    if (id.includes("user")) return "user";
                    if (id.includes("organization/settings")) return "organization-settings";
                    if (id.includes("organization")) return "organization";
                    if (id.includes("settings")) return "settings";
                    if (id.includes("search")) return "search";
                    if (id.includes("legal")) return "legal";
                    if (id.includes("project/settings")) return "project-settings";
                    if (id.includes("project")) return "project";
                },
            },
        },
    },
    plugins: [reactRouter(), tsconfigPaths()],
});
