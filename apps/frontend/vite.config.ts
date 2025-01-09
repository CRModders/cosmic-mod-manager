import { reactRouter } from "@react-router/dev/vite";
import autoprefixer from "autoprefixer";
import tailwindcss from "tailwindcss";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { reactRouterHonoServer } from "./../../packages/react-router-hono-server/src/dev";

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
    plugins: [reactRouterHonoServer(), reactRouter(), tsconfigPaths()],
});
