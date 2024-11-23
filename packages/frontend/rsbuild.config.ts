import { defineConfig } from "@rsbuild/core";
import { pluginReact } from "@rsbuild/plugin-react";
import { SITE_NAME_LONG, SITE_NAME_SHORT } from "./../shared/config/index";

export default defineConfig({
    plugins: [pluginReact()],

    // server: {
    //     proxy: {
    //         "/api": {
    //             target: "https://api.crmm.tech",
    //             changeOrigin: true,
    //             secure: false,
    //         },
    //     },
    // },

    html: {
        appIcon: "./public/icon.svg",
        title: SITE_NAME_LONG,
        meta: {
            description: {
                name: "description",
                content: `Download Cosmic Reach mods, plugins, datamods, shaders, resourcepacks, and modpacks on ${SITE_NAME_SHORT} (${SITE_NAME_LONG}). Discover and publish projects on ${SITE_NAME_SHORT} with a modern, easy to use interface and API.`,
                "data-react-helmet": "true",
            },
        },
        tags: [
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
