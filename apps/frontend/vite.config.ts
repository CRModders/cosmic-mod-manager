import adapter from "@hono/vite-dev-server/cloudflare";
import { reactRouter } from "@react-router/dev/vite";
import { cloudflareDevProxy } from "@react-router/dev/vite/cloudflare";
import autoprefixer from "autoprefixer";
import serverAdapter from "hono-react-router-adapter/vite";
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
    plugins: [
        cloudflareDevProxy(),
        serverAdapter({
            adapter,
            entry: "server/index.ts",
        }),
        reactRouter(),
        tsconfigPaths(),
    ],
});
