import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
    title: "CRMM Docs",
    description: "Documentation for CRMM backend API",
    sitemap: {
        hostname: "https://docs.crmm.tech",
    },
    themeConfig: {
        logo: { src: 'https://assets.crmm.tech/icon.svg', width: 24, height: 24 },

        editLink: {
            pattern: (data) => {
                return `https://github.com/CRModders/cosmic-mod-manager/blob/main/apps/docs/${data.filePath}`
            },
        },

        search: {
            provider: "local"
        },

        sidebar: [
            { text: "Introduction", link: "/", },
            {
                text: "Project",
                items: [
                    { text: "Search Projects", link: "/project/search" },
                    { text: "Search a project", link: "/project/get" },
                    { text: "Get multiple projects", link: "/project/get-multiple" },
                    { text: "Get random projects", link: "/project/random" },
                    { text: "Modify a project", link: "/project/modify" },
                ]
            },
            {
                text: "Version",
                items: [
                    { text: "Upload a version", link: "/version/upload" }
                ]
            },
        ],

        socialLinks: [{ icon: "github", link: "https://github.com/CRModders/cosmic-mod-manager" }],
    },
});
