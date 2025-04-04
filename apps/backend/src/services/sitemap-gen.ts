import { projectTypes } from "@app/utils/config/project";
import { ProjectType } from "@app/utils/types";
import { type ProjectSearchDocument, projectSearchNamespace } from "~/routes/search/sync-utils";
import meilisearch from "~/services/meilisearch";
import { getFileFromLocalStorage, saveFileToLocalStorage } from "~/services/storage/local";
import env from "~/utils/env";

const BATCH_SIZE = 1000;
const SITEMAP_REFRESH_INTERVAL_s = 86400; // 24 hours
let queued = false;
let isGenerating = false;

export async function startSitemapGenerator() {
    if (queued) return;
    if (env.NODE_ENV === "development") return;

    queued = true;

    await generateSitemap();
    setInterval(generateSitemap, SITEMAP_REFRESH_INTERVAL_s * 1000);
}

let startupTries = 20;
export async function generateSitemap() {
    if (isGenerating) return;
    isGenerating = true;
    try {
        const index = meilisearch.index(projectSearchNamespace);
        const res = await index.search(null);
        if (res.estimatedTotalHits === 0) {
            startupTries -= 1;
            if (startupTries > 0) {
                console.log("Waiting for projects to be indexed...");
            } else {
                console.error("Failed to generate sitemap, no projects found");
                return;
            }

            return setTimeout(() => {
                generateSitemap();
            }, 2_000);
        }
        startupTries = 10;
        console.log("Starting sitemap generation...");

        const fragments = await collectSitemapFragments();

        await saveSitemap("index", fragments.index);
        await saveSitemap("nav", navigationLinksXml());
        await saveSitemap(ProjectType.MOD, fragments.mods, "s");
        await saveSitemap(ProjectType.DATAMOD, fragments.dataModLinks, "s");
        await saveSitemap(ProjectType.RESOURCE_PACK, fragments.resourcePackLinks, "s");
        await saveSitemap(ProjectType.SHADER, fragments.shaderPackLinks, "s");
        await saveSitemap(ProjectType.MODPACK, fragments.modpackLinks, "s");
        await saveSitemap(ProjectType.PLUGIN, fragments.pluginLinks, "s");
        await saveSitemap(ProjectType.WORLD, fragments.worldLinks, "s");

        console.log("Sitemap generation complete");
    } finally {
        isGenerating = false;
    }
}

async function collectSitemapFragments() {
    let offset = 0;

    // Mods
    let modLinks = "";
    while (true) {
        const mods = await getProjects(ProjectType.MOD, offset);
        if (mods.length === 0) break;
        modLinks += await generateXml(ProjectType.MOD, mods);
        offset += BATCH_SIZE;
    }
    offset = 0;

    // Datamods
    let dataModLinks = "";
    while (true) {
        const datamods = await getProjects(ProjectType.DATAMOD, offset);
        if (datamods.length === 0) break;
        dataModLinks += await generateXml(ProjectType.DATAMOD, datamods);
        offset += BATCH_SIZE;
    }
    offset = 0;

    // Resource packs
    let resourcePackLinks = "";
    while (true) {
        const resourcePacks = await getProjects(ProjectType.RESOURCE_PACK, offset);
        if (resourcePacks.length === 0) break;
        resourcePackLinks += await generateXml(ProjectType.RESOURCE_PACK, resourcePacks);
        offset += BATCH_SIZE;
    }
    offset = 0;

    // Shader packs
    let shaderPackLinks = "";
    while (true) {
        const shaderPacks = await getProjects(ProjectType.SHADER, offset);
        if (shaderPacks.length === 0) break;
        shaderPackLinks += await generateXml(ProjectType.SHADER, shaderPacks);
        offset += BATCH_SIZE;
    }
    offset = 0;

    // Modpacks
    let modpackLinks = "";
    while (true) {
        const modpacks = await getProjects(ProjectType.MODPACK, offset);
        if (modpacks.length === 0) break;
        modpackLinks += await generateXml(ProjectType.MODPACK, modpacks);
        offset += BATCH_SIZE;
    }
    offset = 0;

    // Plugins
    let pluginLinks = "";
    while (true) {
        const plugins = await getProjects(ProjectType.PLUGIN, offset);
        if (plugins.length === 0) break;
        pluginLinks += await generateXml(ProjectType.PLUGIN, plugins);
        offset += BATCH_SIZE;
    }
    offset = 0;

    // Worlds
    let worldLinks = "";
    while (true) {
        const worlds = await getProjects(ProjectType.WORLD, offset);
        if (worlds.length === 0) break;
        worldLinks += await generateXml(ProjectType.WORLD, worlds);
        offset += BATCH_SIZE;
    }

    const indexFile = `<?xml version="1.0" encoding="UTF-8"?>
    <sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        <sitemap>
            <loc>${env.FRONTEND_URL}/sitemap-nav.xml</loc>
        </sitemap>
        <sitemap>
            <loc>${env.FRONTEND_URL}/sitemap-${ProjectType.MOD}s.xml</loc>
        </sitemap>
        <sitemap>
            <loc>${env.FRONTEND_URL}/sitemap-${ProjectType.DATAMOD}s.xml</loc>
        </sitemap>
        <sitemap>
            <loc>${env.FRONTEND_URL}/sitemap-${ProjectType.RESOURCE_PACK}s.xml</loc>
        </sitemap>
        <sitemap>
            <loc>${env.FRONTEND_URL}/sitemap-${ProjectType.SHADER}s.xml</loc>
        </sitemap>
        <sitemap>
            <loc>${env.FRONTEND_URL}/sitemap-${ProjectType.MODPACK}s.xml</loc>
        </sitemap>
        <sitemap>
            <loc>${env.FRONTEND_URL}/sitemap-${ProjectType.PLUGIN}s.xml</loc>
        </sitemap>
        <sitemap>
            <loc>${env.FRONTEND_URL}/sitemap-${ProjectType.WORLD}s.xml</loc>
        </sitemap>
    </sitemapindex>
        `;

    return {
        index: indexFile,
        mods: xmlUrlSet(modLinks),
        dataModLinks: xmlUrlSet(dataModLinks),
        resourcePackLinks: xmlUrlSet(resourcePackLinks),
        shaderPackLinks: xmlUrlSet(shaderPackLinks),
        modpackLinks: xmlUrlSet(modpackLinks),
        pluginLinks: xmlUrlSet(pluginLinks),
        worldLinks: xmlUrlSet(worldLinks),
    };
}

async function generateXml(type: ProjectType, projects: ProjectSearchDocument[]) {
    let links = "";
    for (let i = 0; i < projects.length; i++) {
        const project = projects[i];
        links += `
    <url>
        <loc>${env.FRONTEND_URL}/${type}/${project.slug}</loc>
        <lastmod>${formatDate(project.dateUpdated)}</lastmod>
    </url>
    <url>
        <loc>${env.FRONTEND_URL}/${type}/${project.slug}/gallery</loc>
        <lastmod>${formatDate(project.dateUpdated)}</lastmod>
    </url>
    <url>
        <loc>${env.FRONTEND_URL}/${type}/${project.slug}/versions</loc>
        <lastmod>${formatDate(project.dateUpdated)}</lastmod>
    </url>
    <url>
        <loc>${env.FRONTEND_URL}/${type}/${project.slug}/version/latest</loc>
        <lastmod>${formatDate(project.dateUpdated)}</lastmod>
    </url>
        `;
    }

    return links;
}

async function getProjects(type: ProjectType, offset: number): Promise<ProjectSearchDocument[]> {
    const index = meilisearch.index(projectSearchNamespace);

    const result = await index.search(null, {
        sort: ["downloads:desc"],
        limit: BATCH_SIZE,
        offset: offset,
        filter: [`type = ${type}`],
    });
    const hits = result.hits as ProjectSearchDocument[];

    return hits;
}

function formatDate(_date: Date | string): string {
    const date = new Date(_date);
    return [date.getFullYear(), String(date.getMonth() + 1).padStart(2, "0"), String(date.getDate()).padStart(2, "0")].join("-");
}

function xmlUrlSet(links: string) {
    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${links}
</urlset>`;
}

async function saveSitemap(name: string, content: string, nameSuffix = "") {
    try {
        await saveFileToLocalStorage(`sitemap/sitemap-${name}${nameSuffix}.xml`, content);
    } catch (error) {
        console.error("Failed to save sitemap", error);
    }
}

export async function getSitemap(name: string) {
    try {
        if (name === "sitemap.xml") return await getFileFromLocalStorage("sitemap/sitemap-index.xml");

        return await getFileFromLocalStorage(`sitemap/${name}`);
    } catch (error) {
        console.error("Failed to get sitemap", error);
    }
}

function navigationLinksXml() {
    let links = "";

    links += xmlURL("");
    links += xmlURL("md-editor");

    for (const type of ["project", ...projectTypes]) {
        links += xmlURL(`${type}s`);
    }

    return xmlUrlSet(links);
}

function xmlURL(path: string) {
    return `
    <url>
        <loc>${env.FRONTEND_URL}/${path}</loc>
    </url>
    `;
}
