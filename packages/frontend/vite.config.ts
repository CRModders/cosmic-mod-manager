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
                experimentalMinChunkSize: 33_000, // 5kb
                manualChunks: (id) => {
                    if (id.includes("css")) return "styles";

                    // Routes
                    if (id.includes("project")) return "project";
                    if (id.includes("user")) return "user";
                    if (id.includes("dashboard")) return "dashboard";
                    if (id.includes("settings")) return "settings";
                    if (id.includes("auth")) return "auth";
                    if (id.includes("organization")) return "organization";
                    if (id.includes("legal")) return "legal";
                    if (id.includes("search")) return "search";

                    // Catchall for leftover routes
                    if (id.includes("routes")) return "routes";
                    if (id.includes("pages")) return "pages";

                    if (id.includes("hooks")) return "hooks";
                    if (id.includes("components/ui")) return "ui";
                    if (id.includes("components")) return "components";
                    if (id.includes("utils")) return "misc";
                    if (id.includes("/app/")) return "root";
                    if (id.includes("schemas") || id.includes("zod")) return "zod";

                    // Libs
                    if (id.includes("highlight.js")) return "highlight-js";
                    if (id.includes("@tanstack")) return "tanstack";
                    if (id.includes("radix") || id.includes("lucide")) return "ui-lib";
                    if (id.includes("xss") || id.includes("cssfilter")) return "xss";
                    if (id.includes("markdown-it") || id.includes("mdurl")) return "markdown-it";
                    if (id.includes("react")) return "react";
                    if (id.includes("use-")) return "lib-hooks";

                    if (id.includes("node_modules")) return "vendor";
                    return "app";
                },
            },
        },
        cssCodeSplit: false,
    },
    plugins: [reactRouter(), tsconfigPaths()],
});
