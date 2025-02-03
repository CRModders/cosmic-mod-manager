import { defineConfig } from "vitepress";

export default defineConfig({
    title: "CRMM Docs",
    description: "Documentation for CRMM backend API",
    sitemap: {
        hostname: "https://docs.crmm.tech",
    },

    metaChunk: true,
    lastUpdated: true,

    themeConfig: {
        logo: { src: "https://assets.crmm.tech/icon.svg", width: 24, height: 24 },

        editLink: {
            pattern: (data) => {
                return `https://github.com/CRModders/cosmic-mod-manager/blob/main/apps/docs/${data.filePath}`;
            },
        },

        search: {
            provider: "local",
        },

        sidebar: [
            { text: "Introduction", link: "/" },
            {
                text: "Project",
                items: [
                    { text: "Search Projects", link: "/project/search" },
                    { text: "Search a project", link: "/project/get" },
                    { text: "Get multiple projects", link: "/project/get-multiple" },
                    { text: "Get random projects", link: "/project/random" },
                    { text: "Modify a project", link: "/project/modify" },
                ],
            },
            {
                text: "Version",
                items: [{ text: "Upload a version", link: "/version/upload" }],
            },

            { text: "CONTRIBUTING.md", link: "/contributing" },
            { text: "TRANSLATING.md", link: "/translating" },
            { text: "ENDPOINTS.md", link: "/endpoints" },
            { text: "CREDITS.md", link: "/credits" },
        ],

        socialLinks: [{ icon: "github", link: "https://github.com/CRModders/cosmic-mod-manager" }],
    },

    markdown: {
        config: (md) => {
            md.use((md) => {
                md.renderer.rules.link_open = (tokens, idx, options, env, self) => {
                    const token = tokens[idx];
                    if (!token.attrs) return self.renderToken(tokens, idx, options);

                    for (let i = 0; i < token.attrs.length; i++) {
                        const attr = token.attrs[i];
                        if (attr[0] !== "href") continue;
                        if (attr[1].startsWith("http") || attr[1].startsWith("#")) continue;

                        token.attrs.push(["target", "_blank"]);

                        // Prefix all relative links with the GitHub URL
                        if (attr[1].startsWith("/apps/") || attr[1].startsWith("/packages/")) {
                            attr[1] = `https://github.com/CRModders/cosmic-mod-manager/blob/main${attr[1]}`;
                            break;
                        }

                        // Prefix all /api links with the api url
                        if (attr[1].startsWith("/api/")) {
                            attr[1] = `https://api.crmm.tech${attr[1]}`;
                            break;
                        }
                    }

                    return self.renderToken(tokens, idx, options);
                };
            });
        },
    },
});
