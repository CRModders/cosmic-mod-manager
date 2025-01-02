import type { Prisma } from "@prisma/client";
import { cacheKey } from "~/services/cache/utils";
import prisma from "~/services/prisma";
import redis from "~/services/redis";
import { PROJECT_DETAILS_CACHE_KEY, PROJECT_LIST_ITEM_CACHE_KEY } from "~/types/namespaces";
import { GetData_FromCache, PROJECT_CACHE_EXPIRY_seconds } from "./_cache";

// ? Select fields
const Team_Select = {
    select: {
        id: true,
        members: {
            select: {
                id: true,
                teamId: true,
                userId: true,
                role: true,
                isOwner: true,
                permissions: true,
                organisationPermissions: true,
                accepted: true,
                dateAccepted: true,

                user: {
                    select: {
                        id: true,
                        userName: true,
                        avatar: true,
                    },
                },
            },
            orderBy: { dateAccepted: "asc" },
        },
    } satisfies Prisma.TeamSelect,
};

const PROJECT_DETAILS_SELECT_FIELDS = {
    id: true,
    teamId: true,
    organisationId: true,

    name: true,
    slug: true,
    type: true,
    summary: true,
    description: true,
    iconFileId: true,
    licenseId: true,
    licenseName: true,
    licenseUrl: true,
    downloads: true,
    followers: true,
    categories: true,
    featuredCategories: true,
    loaders: true,
    gameVersions: true,

    datePublished: true,
    dateUpdated: true,
    dateApproved: true,
    dateQueued: true,
    requestedStatus: true,
    status: true,
    visibility: true,

    clientSide: true,
    serverSide: true,

    issueTrackerUrl: true,
    projectSourceUrl: true,
    projectWikiUrl: true,
    discordInviteUrl: true,

    color: true,

    gallery: {
        select: {
            id: true,
            imageFileId: true,
            thumbnailFileId: true,
            projectId: true,
            name: true,
            description: true,
            featured: true,
            dateCreated: true,
            orderIndex: true,
        },
        orderBy: { orderIndex: "desc" },
    },

    team: Team_Select,

    organisation: {
        select: {
            id: true,
            teamId: true,
            iconFileId: true,

            name: true,
            slug: true,
            description: true,
            team: Team_Select,
        },
    },
} satisfies Prisma.ProjectSelect;

const PROJECT_LIST_ITEM_SELECT_FIELDS = {
    id: true,
    teamId: true,
    iconFileId: true,
    organisationId: true,

    slug: true,
    name: true,
    summary: true,
    type: true,
    downloads: true,
    followers: true,
    clientSide: true,
    serverSide: true,
    featuredCategories: true,
    categories: true,
    gameVersions: true,
    loaders: true,
    color: true,

    dateUpdated: true,
    datePublished: true,
    dateQueued: true,
    dateApproved: true,
    status: true,
    requestedStatus: true,
    visibility: true,

    team: Team_Select,

    // TODO: Move this to organization_item.ts when it's created
    organisation: {
        select: {
            id: true,
            teamId: true,
            iconFileId: true,

            name: true,
            slug: true,
            description: true,
            team: Team_Select,
        },
    },
} satisfies Prisma.ProjectSelect;

// ? Get project functions
export type GetProject_Details_ReturnTye = Awaited<ReturnType<typeof GetProject_Details_FromDb>>;
async function GetProject_Details_FromDb(slug?: string, id?: string) {
    if (!slug && !id) throw new Error("Either the project id or slug is required!");

    let data = undefined;
    // If both id and slug are provided, check if any table matches either one
    if (id && slug) {
        data = await prisma.project.findFirst({
            where: {
                OR: [{ id: id }, { slug: slug }],
            },
            select: PROJECT_DETAILS_SELECT_FIELDS,
        });
    } else if (id) {
        data = await prisma.project.findUnique({
            where: {
                id: id,
            },
            select: PROJECT_DETAILS_SELECT_FIELDS,
        });
    } else {
        data = await prisma.project.findUnique({
            where: {
                slug: slug,
            },
            select: PROJECT_DETAILS_SELECT_FIELDS,
        });
    }

    return data;
}

export async function GetProject_Details(slug?: string, id?: string, cachedOnly = false) {
    if (!slug && !id) throw new Error("Either the project id or slug is required!");

    const cachedData = await GetData_FromCache<GetProject_Details_ReturnTye>(PROJECT_DETAILS_CACHE_KEY, slug || id);
    if (cachedData) return cachedData;

    // If cachedOnly is true, we won't get the data from the db
    if (cachedOnly === true) return null;

    const data = await GetProject_Details_FromDb(slug, id);
    if (data) await Set_ProjectCache(PROJECT_DETAILS_CACHE_KEY, data);

    return data;
}

export type GetProject_ListItem_ReturnTye = Awaited<ReturnType<typeof GetProject_ListItem_FromDb>>;
async function GetProject_ListItem_FromDb(slug?: string, id?: string) {
    if (!slug && !id) throw new Error("Either the project id or slug is required!");

    let data = undefined;

    if (id && slug) {
        data = await prisma.project.findFirst({
            where: {
                OR: [{ id: id }, { slug: slug }],
            },
            select: PROJECT_LIST_ITEM_SELECT_FIELDS,
        });
    }
    // Prioritize using id for query over using slugs
    else if (id) {
        data = await prisma.project.findUnique({
            where: {
                id: id,
            },
            select: PROJECT_LIST_ITEM_SELECT_FIELDS,
        });
    } else {
        data = await prisma.project.findUnique({
            where: {
                slug: slug,
            },
            select: PROJECT_LIST_ITEM_SELECT_FIELDS,
        });
    }

    return data;
}

export async function GetProject_ListItem(slug?: string, id?: string, cachedOnly = false) {
    if (!slug && !id) throw new Error("Either the project id or slug is required!");

    const cachedData = await GetData_FromCache<GetProject_ListItem_ReturnTye>(PROJECT_LIST_ITEM_CACHE_KEY, slug || id);
    if (cachedData?.id) return cachedData;
    if (cachedOnly === true) return null;

    const data = await GetProject_ListItem_FromDb(slug, id);
    if (data?.id) {
        await Set_ProjectCache(PROJECT_LIST_ITEM_CACHE_KEY, data);
    }

    return data;
}

export type GetManyProjects_ListItem_ReturnTye = Awaited<ReturnType<typeof GetManyProjects_ListItem>>;
export async function GetManyProjects_ListItem(ids: string[]) {
    const ProjectIds_RetrievedFromCache: string[] = [];
    const cachedProjects: GetProject_ListItem_ReturnTye[] = [];

    // Get all projects from cache, we're not getting non-cached projects because doint that like this will make a db call for each project
    // Rather we'll first get all cached projects and then get the non-cached projects using a findMany query
    {
        const _cachedListItems_promises: Promise<GetProject_ListItem_ReturnTye>[] = [];
        for (const id of ids) {
            if (!id) continue;

            _cachedListItems_promises.push(GetProject_ListItem(undefined, id, true));
        }

        const _cachedListItems = await Promise.all(_cachedListItems_promises);
        for (let i = 0; i < _cachedListItems.length; i++) {
            const item = _cachedListItems[i];
            if (!item?.id) continue;

            cachedProjects.push(item);
            ProjectIds_RetrievedFromCache.push(item.id);
        }
    }

    // Get all non-cached projects
    const RemainingProjectIds = ids.filter((id) => !ProjectIds_RetrievedFromCache.includes(id));
    if (!RemainingProjectIds.length) return cachedProjects;

    const NonCachedProjects = await prisma.project.findMany({
        where: {
            id: {
                in: RemainingProjectIds,
            },
        },
        select: PROJECT_LIST_ITEM_SELECT_FIELDS,
    });

    // Set cache for all non-cached projects
    {
        const _setCache_promises: Promise<void>[] = [];
        for (const project of NonCachedProjects) {
            if (!project?.id) continue;
            _setCache_promises.push(Set_ProjectCache(PROJECT_LIST_ITEM_CACHE_KEY, project));
        }

        await Promise.all(_setCache_promises);
    }

    return cachedProjects.concat(NonCachedProjects);
}

// ? Update and delete project functions
export async function UpdateProject<T extends Prisma.ProjectUpdateArgs>(args: Prisma.SelectSubset<T, Prisma.ProjectUpdateArgs>) {
    const result = await prisma.project.update(args);
    if (result?.id) {
        await Delete_ProjectCache_All(result.id, result.slug);
    }

    return result;
}

export async function UpdateManyProjects<T extends Prisma.ProjectUpdateManyArgs>(
    args: Prisma.SelectSubset<T, Prisma.ProjectUpdateManyArgs>,
    projectIds: string[],
) {
    const result = await prisma.project.updateMany(args);

    const _deleteCache_promises = [];
    for (const id of projectIds) {
        _deleteCache_promises.push(Delete_ProjectCache_All(id));
    }
    await Promise.all(_deleteCache_promises);

    return result;
}

export async function DeleteProject<T extends Prisma.ProjectDeleteArgs>(args: Prisma.SelectSubset<T, Prisma.ProjectDeleteArgs>) {
    const result = await prisma.project.delete(args);
    if (result?.id) {
        await Delete_ProjectCache_All(result.id, result.slug);
    }

    return result;
}

// ? Caching functions
// Cache structure: ProjectId -> ProjectData
//                  ProjectSlug -> ProjectData

export async function Delete_ProjectCache_All(id: string, slug?: string) {
    let projectSlug: string | undefined = slug;

    // If slug is not provided, get it from the cache
    if (!projectSlug) {
        const [_slug1, _slug2] = await Promise.all([
            redis.get(cacheKey(id, PROJECT_DETAILS_CACHE_KEY)),
            redis.get(cacheKey(id, PROJECT_LIST_ITEM_CACHE_KEY)),
        ]);

        projectSlug = _slug1 || _slug2 || "";
    }

    return await redis.del([
        cacheKey(id, PROJECT_LIST_ITEM_CACHE_KEY),
        cacheKey(projectSlug, PROJECT_LIST_ITEM_CACHE_KEY),
        cacheKey(id, PROJECT_DETAILS_CACHE_KEY),
        cacheKey(projectSlug, PROJECT_DETAILS_CACHE_KEY),
    ]);
}

interface SetCache_Data {
    id: string;
    slug: string;
}
async function Set_ProjectCache<T extends SetCache_Data | null>(NAMESPACE: string, project: T) {
    if (!project?.id) return;
    const json_string = JSON.stringify(project);

    const p1 = redis.set(cacheKey(project.id, NAMESPACE), project.slug, "EX", PROJECT_CACHE_EXPIRY_seconds);
    const p2 = redis.set(cacheKey(project.slug, NAMESPACE), json_string, "EX", PROJECT_CACHE_EXPIRY_seconds);
    await Promise.all([p1, p2]);
}
