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
                format: "es",
                manualChunks: (id) => {
                    if (id.includes("node_modules")) {
                        return "vendor";
                    }
                    return "app";
                },
            },
        },
    },
    plugins: [reactRouter(), tsconfigPaths()],
});
