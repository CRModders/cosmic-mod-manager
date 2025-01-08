import { reactRouter } from "@react-router/dev/vite";
import autoprefixer from "autoprefixer";
import { reactRouterHonoServer } from "react-router-hono-server/dev";
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
        reactRouterHonoServer({
            runtime: "bun",
        }),
        reactRouter(),
        tsconfigPaths(),
    ],
});
