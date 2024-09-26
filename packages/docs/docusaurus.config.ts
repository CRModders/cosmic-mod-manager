import type * as Preset from "@docusaurus/preset-classic";
import type { Config } from "@docusaurus/types";
import { themes as prismThemes } from "prism-react-renderer";

const config: Config = {
    title: "CRMM Docs",
    tagline: "API documentation for api.crmm.tech",
    favicon: "images/icon.svg",

    // Set the production url of your site here
    url: "https://docs.crmm.tech",
    // Set the /<baseUrl>/ pathname under which your site is served
    // For GitHub pages deployment, it is often '/<projectName>/'
    baseUrl: "/",
    trailingSlash: false,

    // GitHub pages deployment config.
    // If you aren't using GitHub pages, you don't need these.
    organizationName: "abhinav5383", // Usually your GitHub org/user name.
    projectName: "cosmic-mod-manager", // Usually your repo name.

    onBrokenLinks: "throw",
    onBrokenMarkdownLinks: "warn",

    // Even if you don't use internationalization, you can use this field to set
    // useful metadata like html lang. For example, if your site is Chinese, you
    // may want to replace "en" with "zh-Hans".
    i18n: {
        defaultLocale: "en",
        locales: ["en"],
    },

    presets: [
        [
            "classic",
            {
                docs: {
                    routeBasePath: "/",
                    sidebarPath: "./sidebars.ts",
                    editUrl: "https://github.com/CRModders/cosmic-mod-manager/tree/main/packages/docs/",
                },
                blog: false,
                theme: {
                    customCss: "./src/css/custom.css",
                },
            } satisfies Preset.Options,
        ],
    ],

    themeConfig: {
        // image: "img/docusaurus-social-card.jpg",
        navbar: {
            title: "CRMM Docs",
            hideOnScroll: true,
            logo: {
                alt: "CRMM",
                src: "images/icon.svg",
            },
            items: [
                {
                    href: "https://github.com/crmodders/cosmic-mod-manager",
                    label: "GitHub",
                    position: "right",
                },
            ],
        },
        footer: {
            style: "dark",
            links: [
                {
                    label: "GitHub",
                    to: "https://github.com/crmodders/cosmic-mod-manager",
                },
                {
                    label: "Discord",
                    to: "https://discord.gg/T2pFVHmFpH",
                },
                {
                    label: "CRMM",
                    to: "https://crmm.tech",
                },
            ],
            copyright: `Copyright © ${new Date().getFullYear()} CRMM, Built with Docusaurus.`,
        },
        prism: {
            theme: prismThemes.github,
            darkTheme: prismThemes.dracula,
        },
    } satisfies Preset.ThemeConfig,
};

export default config;
