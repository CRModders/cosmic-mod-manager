import { defineConfig } from "@rsbuild/core";
import { pluginReact } from "@rsbuild/plugin-react";

export default defineConfig({
    plugins: [pluginReact()],

    html: {
        title: "CRMM",
        tags: [
            {
                tag: "html",
                attrs: {
                    class: "dark",
                },
                append: false,
            },
            {
                tag: "link",
                attrs: {
                    rel: "preconnect",
                    href: "https://fonts.googleapis.com",
                },
                head: true,
                append: true,
            },
            {
                tag: "link",
                attrs: {
                    rel: "stylesheet",
                    href: "https://fonts.googleapis.com/css2?&family=Inter:wght@100..900&display=swap",
                },
                head: true,
                append: true,
            },
            {
                tag: "link",
                attrs: {
                    rel: "icon",
                    type: "image/svg+xml",
                    href: "/icon.svg",
                },
                head: true,
                append: true,
            },
        ],
    },
});
