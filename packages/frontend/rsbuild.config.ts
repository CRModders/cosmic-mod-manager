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
                    lang: "en",
                },
                append: false,
            },
            {
                tag: "link",
                attrs: {
                    rel: "preconnect",
                    href: "https://api.crmm.tech",
                },
                head: true,
                append: true,
            },
            {
                tag: "link",
                attrs: {
                    rel: "preconnect",
                    href: "https://crmm-cdn.global.ssl.fastly.net",
                },
                head: true,
                append: true,
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
                    rel: "preconnect",
                    href: "https://fonts.gstatic.com",
                },
                head: true,
                append: true,
            },
            {
                tag: "link",
                attrs: {
                    rel: "preload",
                    href: "https://fonts.googleapis.com/css2?&family=Inter:wght@100..900&display=swap",
                    as: "style",
                    onload: "this.onload=null;this.rel='stylesheet'",
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
