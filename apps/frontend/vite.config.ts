import { reactRouter } from "@react-router/dev/vite";
import autoprefixer from "autoprefixer";
import tailwindcss from "tailwindcss";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { formatLocaleCode } from "./app/locales";
import SupportedLocales, { DefaultLocale } from "./app/locales/meta";

const localesList = SupportedLocales.map((locale) => formatLocaleCode(locale)).filter(
    (locale) => locale !== formatLocaleCode(DefaultLocale),
);

const routes = [
    "/",
    "/auth",
    "/settings",
    "/dashboard",
    "/search",
    "/legal",
    "/about",
    "/user",
    "/project/settings",
    "/project",
    "/organization/settings",
    "/organization",
];

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
                    // Locales
                    for (const locale of localesList) {
                        if (id.includes(`locales/${locale}`)) return `locale-${locale}`;
                    }
                    if (id.includes("locales/en")) return "locale-en";
                    // if (id.includes("locales")) return "locales";

                    // CSS
                    if (id.endsWith(".css") && id.includes("components")) return "component-styles";
                    if (id.endsWith(".css")) return "styles";

                    // packages/utils
                    if (id.includes("packages/utils")) {
                        if (id.includes("schemas")) return "zod-schemas";
                        return "utils-lib";
                    }

                    // app/utils
                    if (id.includes("app/utils")) return "app-utils";

                    // Group by routes
                    if (id.includes("frontend/app/pages")) {
                        for (const route of routes) {
                            if (matchRoute(id, route)) {
                                return `route-${formatRouteName(route)}`;
                            }
                        }
                    }
                },
            },
        },
    },
    plugins: [reactRouter(), tsconfigPaths()],
});

function matchRoute(id: string, route: string) {
    const nextPart = id.split(`pages${route}`)[1];
    if (!nextPart) return false;

    if (route === "/") {
        if (nextPart.includes("/")) return false;
        return true;
    }

    if (nextPart.startsWith("/")) return true;
    return false;
}

function formatRouteName(route: string) {
    if (route === "/") return "home";
    return route.replace("/", "").replaceAll("/", "-");
}
