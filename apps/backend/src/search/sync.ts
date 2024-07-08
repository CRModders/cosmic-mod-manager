import { MeiliSearch } from "meilisearch";
import meilisearch from "@/lib/search-service";
import prisma from "@/lib/prisma";
import { projectsSearchIndexName } from "@root/config";
import { ProjectVisibility, type SearchResult, UserRolesInProject } from "@root/types";

let isSyncing = false;

const selectedProjectFields = {
    id: true,
    name: true,
    url_slug: true,
    type: true,
    license: true,
    summary: true,
    tags: true,
    featured_tags: true,
    icon: true,
    total_downloads: true,
    created_on: true,
    updated_on: true,
    members: {
        where: {
            role: UserRolesInProject.OWNER,
        },
        select: {
            user_id: true,
            role: true,
            role_title: true,
            user: {
                select: {
                    user_name: true,
                },
            },
        },
    },
    versions: {
        select: {
            supported_game_versions: true,
            supported_loaders: true,
        },
    },
    external_links: {
        select: {
            project_source_link: true,
        },
    },
};

const syncMeilisearchWithPostgres = async () => {
    try {
        if (isSyncing) return;
        isSyncing = true;

        // An index is where the documents are stored.
        const index = meilisearch.index(projectsSearchIndexName);

        const projects = await prisma.project.findMany({
            where: {
                OR: [{ visibility: ProjectVisibility.LISTED }, { visibility: ProjectVisibility.PUBLIC }],
            },
            select: selectedProjectFields,
        });

        const formattedProjectData = [];
        for (const project of projects) {
            const supportedGameVersionsList: string[] = [];
            for (const projectVersion of project.versions) {
                supportedGameVersionsList.push(...projectVersion.supported_game_versions);
            }
            const supportedGameVersions_set = new Set(supportedGameVersionsList);

            const supportedLoadersList: string[] = [];
            for (const projectVersion of project.versions) {
                supportedLoadersList.push(...projectVersion.supported_loaders);
            }
            const supportedLoaders_set = new Set(supportedLoadersList);

            formattedProjectData.push({
                id: project.id,
                name: project.name,
                url_slug: project.url_slug,
                type: project.type,
                license: project.license,
                summary: project.summary,
                tags: project.tags,
                featured_tags: project.featured_tags,
                oss: !!project?.external_links?.project_source_link || false,
                icon: project.icon,
                total_downloads: project.total_downloads,
                created_on: project.created_on,
                updated_on: project.updated_on,
                author: project.members[0].user.user_name,
                game_versions: Array.from(supportedGameVersions_set),
                loaders: Array.from(supportedLoaders_set),
            } satisfies SearchResult);
        }

        await index.addDocuments(formattedProjectData);
    } catch (err) {
        console.error(err);
    } finally {
        isSyncing = false;
    }
};

export const updateProjectToSearchIndex = async (projectId: string) => {
    try {
        const index = meilisearch.index(projectsSearchIndexName);
        const project = await prisma.project.findUnique({
            where: {
                id: projectId,
                OR: [{ visibility: ProjectVisibility.LISTED }, { visibility: ProjectVisibility.PUBLIC }],
            },
            select: selectedProjectFields,
        });

        const supportedGameVersionsList: string[] = [];
        for (const projectVersion of project.versions) {
            supportedGameVersionsList.push(...projectVersion.supported_game_versions);
        }
        const supportedGameVersions_set = new Set(supportedGameVersionsList);

        const supportedLoadersList: string[] = [];
        for (const projectVersion of project.versions) {
            supportedLoadersList.push(...projectVersion.supported_loaders);
        }
        const supportedLoaders_set = new Set(supportedLoadersList);

        index.addDocuments([
            {
                id: project.id,
                name: project.name,
                url_slug: project.url_slug,
                type: project.type,
                license: project.license,
                summary: project.summary,
                tags: project.tags,
                featured_tags: project.featured_tags,
                oss: !!project?.external_links?.project_source_link || false,
                icon: project.icon,
                total_downloads: project.total_downloads,
                created_on: project.created_on,
                updated_on: project.updated_on,
                author: project.members[0].user.user_name,
                game_versions: Array.from(supportedGameVersions_set),
                loaders: Array.from(supportedLoaders_set),
            } satisfies SearchResult,
        ]);
    } catch (err) {
        console.error(err);
    }
};

export const deleteProjectFromSearchIndex = async (projectId: string) => {
    try {
        const index = meilisearch.index(projectsSearchIndexName);
        index.deleteDocument(projectId);
    } catch (err) {
        console.error(err);
    }
};

syncMeilisearchWithPostgres();

const index = meilisearch.index(projectsSearchIndexName);
index.updateFilterableAttributes(["tags", "loaders", "type", "game_versions", "oss"]);
index.updateSortableAttributes(["total_downloads", "follow_count", "updated_on", "created_on"]);
index.updateRankingRules(["sort", "words", "typo", "proximity", "attribute"]);
index.updateSearchableAttributes(["name", "url_slug", "summary", "author"]);

export default syncMeilisearchWithPostgres;
