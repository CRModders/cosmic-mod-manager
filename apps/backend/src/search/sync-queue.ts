import { EnvironmentSupport, ProjectVisibility } from "@app/utils/types";
import meilisearch from "~/services/meilisearch";
import prisma from "~/services/prisma";
import { projectGalleryFileUrl, projectIconUrl } from "~/utils/urls";

export const projectSearchNamespace = "projects";
const SYNC_BATCH_SIZE = 1000;
const SYNC_INTERVAL = 1800_000; // 30 minutes
let isSyncing = false;

const teamSelect = {
    team: {
        select: {
            members: {
                where: { isOwner: true },
                select: {
                    user: {
                        select: {
                            userName: true,
                        },
                    },
                },
            },
        },
    },
};

const requiredProjectFields = {
    id: true,
    name: true,
    slug: true,
    type: true,
    iconFileId: true,
    loaders: true,
    gameVersions: true,
    categories: true,
    featuredCategories: true,
    summary: true,
    downloads: true,
    followers: true,
    datePublished: true,
    dateUpdated: true,
    clientSide: true,
    serverSide: true,
    projectSourceUrl: true,
    visibility: true,
    color: true,
    ...teamSelect,
    organisation: {
        select: {
            slug: true,
        },
    },
    gallery: {
        where: {
            featured: true,
        },
    },
};

export interface ProjectSearchDocument {
    id: string;
    name: string;
    slug: string;
    iconUrl: string | null;
    loaders: string[];
    type: string[];
    gameVersions: string[];
    categories: string[];
    featuredCategories: string[];
    clientSide: boolean;
    serverSide: boolean;
    summary: string;
    downloads: number;
    followers: number;
    datePublished: Date;
    dateUpdated: Date;
    openSource: boolean;
    author: string;
    featured_gallery: string | null;
    color: string | null;
    isOrgOwned: boolean;
    visibility: ProjectVisibility;
}

async function syncProjects(cursor: null | string) {
    try {
        const index = meilisearch.index(projectSearchNamespace);

        const projects = await prisma.project.findMany({
            where: {
                visibility: {
                    in: [ProjectVisibility.LISTED, ProjectVisibility.ARCHIVED],
                },
                // TODO: status: ProjectPublishingStatus.APPROVED,
            },
            cursor: cursor ? { id: cursor } : undefined,
            take: SYNC_BATCH_SIZE,
            skip: cursor ? 1 : 0,
            select: requiredProjectFields,
        });

        if (projects.length === 0) return;

        const formattedProjectsData: ProjectSearchDocument[] = [];
        for (const project of projects) {
            if (project.gameVersions.length === 0) continue;

            const author = project.organisation?.slug || project.team.members?.[0]?.user?.userName;
            const featured_gallery = project.gallery[0] ? projectGalleryFileUrl(project.id, project.gallery[0].thumbnailFileId) : null;

            formattedProjectsData.push({
                id: project.id,
                name: project.name,
                slug: project.slug,
                iconUrl: projectIconUrl(project.id, project.iconFileId),
                loaders: project.loaders,
                type: project.type,
                gameVersions: project.gameVersions,
                categories: project.categories,
                featuredCategories: project.featuredCategories,
                summary: project.summary,
                downloads: project.downloads,
                followers: project.followers,
                datePublished: project.datePublished,
                dateUpdated: project.dateUpdated,
                openSource: !!project.projectSourceUrl,
                clientSide: project.clientSide === EnvironmentSupport.OPTIONAL || project.clientSide === EnvironmentSupport.REQUIRED,
                serverSide: project.serverSide === EnvironmentSupport.OPTIONAL || project.serverSide === EnvironmentSupport.REQUIRED,
                featured_gallery: featured_gallery,
                color: project.color,
                author: author,
                isOrgOwned: !!project.organisation?.slug,
                visibility: project.visibility as ProjectVisibility,
            });
        }

        await index.addDocuments(formattedProjectsData);

        if (formattedProjectsData.length < SYNC_BATCH_SIZE) return null;
        return formattedProjectsData[formattedProjectsData.length - 1].id;
    } catch (error) {
        console.error(error);
    }
}

async function syncSearchDb() {
    if (isSyncing) return;
    isSyncing = true;

    try {
        let cursor = null;
        const index = meilisearch.index(projectSearchNamespace);
        await index.deleteAllDocuments();

        await new Promise((resolve) => setTimeout(resolve, 10_000));

        while (true) {
            cursor = await syncProjects(cursor);
            if (!cursor) break;
        }
    } catch (error) {
        console.error(error);
    } finally {
        isSyncing = false;
    }
}

async function queueSearchDbSync() {
    // @ts-ignore
    const intervalId = global.intervalId;
    if (intervalId) clearInterval(intervalId);

    await syncSearchDb();

    // @ts-ignore
    global.intervalId = setInterval(() => {
        syncSearchDb();
    }, SYNC_INTERVAL);
}

const index = meilisearch.index(projectSearchNamespace);
index.updateFilterableAttributes(["categories", "loaders", "type", "gameVersions", "openSource", "clientSide", "serverSide"]);
index.updateSortableAttributes(["downloads", "followers", "dateUpdated", "datePublished"]);
index.updateRankingRules(["sort", "words", "typo", "proximity", "attribute"]);
index.updateSearchableAttributes(["name", "slug", "summary", "author"]);

export default queueSearchDbSync;
