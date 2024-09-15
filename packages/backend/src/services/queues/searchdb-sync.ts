import { inferProjectType } from "@/utils";
import { projectIconUrl } from "@/utils/urls";
import { ProjectSupport, ProjectVisibility } from "@shared/types";
import meilisearch from "../meilisearch";
import prisma from "../prisma";

export const projectSearchNamespace = "projects";
const SYNC_BATCH_SIZE = 250;
const SYNC_INTERVAL = 1800_000; // 30 minutes
let isSyncing = false;

const requiredProjectFields = {
    id: true,
    name: true,
    slug: true,
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
    team: {
        select: {
            members: {
                where: {
                    isOwner: true,
                },
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

interface ProjectSearchDocument {
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
}

const _syncProjects = async (cursor: null | string) => {
    try {
        const index = meilisearch.index(projectSearchNamespace);

        const projects = await prisma.project.findMany({
            where: {
                visibility: {
                    in: [ProjectVisibility.LISTED, ProjectVisibility.ARCHIVED],
                },
                // status: ProjectPublishingStatus.PUBLISHED,
            },
            cursor: cursor ? { id: cursor } : undefined,
            take: SYNC_BATCH_SIZE,
            skip: cursor ? 1 : 0,
            select: requiredProjectFields,
        });

        if (projects.length === 0) return;

        const formattedProjectsData: ProjectSearchDocument[] = [];
        for (const project of projects) {
            const author = project.team.members?.[0];
            formattedProjectsData.push({
                id: project.id,
                name: project.name,
                slug: project.slug,
                iconUrl: project.iconFileId ? projectIconUrl(project.slug, project.iconFileId) : null,
                loaders: project.loaders,
                type: inferProjectType(project.loaders),
                gameVersions: project.gameVersions,
                categories: project.categories,
                featuredCategories: project.featuredCategories,
                summary: project.summary,
                downloads: project.downloads,
                followers: project.followers,
                datePublished: project.datePublished,
                dateUpdated: project.dateUpdated,
                openSource: !!project.projectSourceUrl,
                author: author?.user?.userName,
                clientSide: project.clientSide === ProjectSupport.OPTIONAL || project.clientSide === ProjectSupport.REQUIRED,
                serverSide: project.serverSide === ProjectSupport.OPTIONAL || project.serverSide === ProjectSupport.REQUIRED,
            });
        }

        await index.deleteAllDocuments();
        await index.addDocuments(formattedProjectsData);

        if (formattedProjectsData.length < SYNC_BATCH_SIZE) return null;
        return formattedProjectsData[formattedProjectsData.length - 1].id;
    } catch (error) {
        console.error(error);
    }
};

const syncSearchDb = async () => {
    if (isSyncing) return;
    isSyncing = true;

    try {
        let cursor = null;
        while (true) {
            cursor = await _syncProjects(cursor);
            if (!cursor) break;
        }
    } catch (error) {
        console.error(error);
    } finally {
        isSyncing = false;
    }
};

const queueSearchDbSync = () => {
    // @ts-ignore
    const intervalId = global.intervalId;
    if (intervalId) clearInterval(intervalId);

    // @ts-ignore
    global.intervalId = setInterval(() => {
        syncSearchDb();
    }, SYNC_INTERVAL);
};

const index = meilisearch.index(projectSearchNamespace);
index.updateFilterableAttributes(["categories", "loaders", "type", "gameVersions", "openSource", "clientSide", "serverSide"]);
index.updateSortableAttributes(["downloads", "followers", "dateUpdated", "datePublished"]);
index.updateRankingRules(["sort", "words", "typo", "proximity", "attribute"]);
index.updateSearchableAttributes(["name", "slug", "summary", "author"]);

// Initial sync on server start
syncSearchDb();

export default queueSearchDbSync;
