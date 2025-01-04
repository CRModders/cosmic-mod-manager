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

const RouteChunks = [
    ["org-settings", "/organization/settings/projects/"],
    ["org-settings", "/organization/settings/members/"],
    ["org-settings", "/organization/settings/"],
    ["org", "/organization/"],

    ["project-settings", "/project/settings/members/"],
    ["project-settings", "/project/settings/"],
    ["project", "/project/version/"],
    ["project", "/project/gallery/"],
    ["project", "/project/"],

    ["search", "/search/"],

    ["user", "/user/"],

    ["settings", "/settings/account/password/"],
    ["settings", "/settings/account/"],
    ["settings", "/settings/sessions/"],
    ["settings", "/settings/"],

    ["moderation", "/moderation/"],

    ["dashboard", "/dashboard/notification/"],
    ["dashboard", "/dashboard/organization/"],
    ["dashboard", "/dashboard/projects/"],

    ["auth", "/auth/signup/"],
    ["auth", "/auth/login/"],
    ["auth", "/auth/confirm-action/"],
    ["auth", "/auth/callback/"],

    ["home", "/"],
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

                    // CSS
                    if (id.endsWith(".css") && id.includes("components")) return "component-styles";
                    if (id.endsWith(".css")) return "styles";

                    // Libraries
                    if (id.includes("radix-ui")) return "radix-ui";
                    if (id.includes("highlight.js") || id.includes("xss")) return "md-renderer";
                    if (id.includes("markdown-it")) return "markdown-it";

                    // Icons
                    if (id.includes("icons") || id.includes("lucide")) return "icons";

                    // UI Components
                    if (id.includes("packages/components")) {
                        if (id.includes("/ui/")) return "ui-components";
                        if (id.includes("/misc/")) return "misc-components";
                        if (id.includes("/md-editor/")) return "md-editor";
                    }

                    // packages/utils
                    if (id.includes("packages/utils")) {
                        if (id.includes("schemas")) return "zod-schemas";
                        return "utils-lib";
                    }

                    // app/utils
                    if (id.includes("app/utils")) return "app-utils";

                    // Group by routes
                    if (id.includes("frontend/app/pages") || id.includes("frontend/app/routes")) {
                        for (const [chunkName, route] of RouteChunks) {
                            if (matchRoute(id, route)) return chunkName;
                        }
                    }
                },
            },
        },
    },
    plugins: [
        // Currently causes bugs with the loading bar
        // babel({
        //     babelConfig: {
        //         presets: ["@babel/preset-typescript"],
        //         plugins: ["babel-plugin-react-compiler"],
        //     },
        // }),
        reactRouter(),
        tsconfigPaths(),
    ],
});

function matchRoute(id: string, route: string) {
    const nextPart = id.split(`pages${route}`)[1] || id.split(`routes${route}`)[1];
    if (!nextPart) return false;

    if (route === "/") {
        if (nextPart.includes("/")) return false;
        return true;
    }

    const parts = nextPart.split("/");
    if (parts.length === 1) return true;
    return false;
}
