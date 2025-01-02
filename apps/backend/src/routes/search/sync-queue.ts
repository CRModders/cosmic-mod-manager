import { EnvironmentSupport, ProjectPublishingStatus, ProjectVisibility } from "@app/utils/types";
import { GetManyProjects_Details, GetProject_Details, type GetProject_Details_ReturnType } from "~/db/project_item";
import meilisearch from "~/services/meilisearch";
import prisma from "~/services/prisma";
import { projectGalleryFileUrl, projectIconUrl } from "~/utils/urls";

export const projectSearchNamespace = "projects";
const SYNC_BATCH_SIZE = 1000;
const SYNC_INTERVAL = 3600_000; // 60 minutes
let isSyncing = false;

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

        const _Projects_Ids = await prisma.project.findMany({
            where: {
                visibility: {
                    in: [ProjectVisibility.LISTED, ProjectVisibility.ARCHIVED],
                },
                status: ProjectPublishingStatus.APPROVED,
            },
            cursor: cursor ? { id: cursor } : undefined,
            take: SYNC_BATCH_SIZE,
            skip: cursor ? 1 : 0,
            select: {
                id: true,
            },
        });

        if (_Projects_Ids.length === 0) return;

        const Projects = await GetManyProjects_Details(_Projects_Ids.map((project) => project.id));
        const formattedProjectsData: ProjectSearchDocument[] = [];

        for (const Project of Projects) {
            if (!Project) continue;
            formattedProjectsData.push(FormatSearchDocument(Project));
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

export async function AddProject_ToSearchDb(projectId: string) {
    const Project = await GetProject_Details(projectId);
    if (!Project) return;

    if (Project.status !== ProjectPublishingStatus.APPROVED) return;
    if (![ProjectVisibility.LISTED, ProjectVisibility.ARCHIVED].includes(Project.visibility as ProjectVisibility)) return;

    const index = meilisearch.index(projectSearchNamespace);
    const formattedProjectData = FormatSearchDocument(Project);

    await index.addDocuments([formattedProjectData]);
}

export async function RemoveProject_FromSearchDb(ProjectId: string) {
    const index = meilisearch.index(projectSearchNamespace);
    await index.deleteDocument(ProjectId);
}

function FormatSearchDocument<T extends NonNullable<GetProject_Details_ReturnType>>(Project: T) {
    const author = Project.organisation?.slug || Project.team.members?.[0]?.user?.userName;
    const FeaturedGalleryItem = Project.gallery.find((item) => item.featured === true);
    const featured_gallery = FeaturedGalleryItem ? projectGalleryFileUrl(Project.id, FeaturedGalleryItem.thumbnailFileId) : null;

    return {
        id: Project.id,
        name: Project.name,
        slug: Project.slug,
        iconUrl: projectIconUrl(Project.id, Project.iconFileId),
        loaders: Project.loaders,
        type: Project.type,
        gameVersions: Project.gameVersions,
        categories: Project.categories,
        featuredCategories: Project.featuredCategories,
        summary: Project.summary,
        downloads: Project.downloads,
        followers: Project.followers,
        datePublished: Project.datePublished,
        dateUpdated: Project.dateUpdated,
        openSource: !!Project.projectSourceUrl,
        clientSide: Project.clientSide === EnvironmentSupport.OPTIONAL || Project.clientSide === EnvironmentSupport.REQUIRED,
        serverSide: Project.serverSide === EnvironmentSupport.OPTIONAL || Project.serverSide === EnvironmentSupport.REQUIRED,
        featured_gallery: featured_gallery,
        color: Project.color,
        author: author,
        isOrgOwned: !!Project.organisation?.slug,
        visibility: Project.visibility as ProjectVisibility,
    };
}
