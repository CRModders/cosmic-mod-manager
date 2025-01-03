import type { Prisma } from "@prisma/client";
import { isProjectIndexable } from "~/routes/project/utils";
import { AddProjects_ToSearchIndex, RemoveProjects_FromSearchIndex, UpdateProjects_SearchIndex } from "~/routes/search/search-db";
import { cacheKey } from "~/services/cache/utils";
import prisma from "~/services/prisma";
import redis from "~/services/redis";
import { PROJECT_DETAILS_CACHE_KEY, PROJECT_LIST_ITEM_CACHE_KEY } from "~/types/namespaces";
import { GetData_FromCache, PROJECT_CACHE_EXPIRY_seconds, SetCache } from "./_cache";
import { Delete_OrganizationCache_All, GetManyOrganizations, GetOrganization_BySlugOrId } from "./organization_item";
import { GetManyTeams, GetTeam } from "./team_item";

// ? Select fields
function PROJECT_DETAILS_SELECT_FIELDS() {
    return {
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
    } satisfies Prisma.ProjectSelect;
}

function PROJECT_LIST_ITEM_SELECT_FIELDS() {
    return {
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
    } satisfies Prisma.ProjectSelect;
}

// ? Get project functions
export type GetProject_Details_FromDb_ReturnType = Awaited<ReturnType<typeof GetProject_Details_FromDb>>;
async function GetProject_Details_FromDb(slug?: string, id?: string) {
    if (!slug && !id) throw new Error("Either the project id or slug is required!");

    let data = undefined;
    // If both id and slug are provided, check if any table matches either one
    if (id && slug) {
        data = await prisma.project.findFirst({
            where: {
                OR: [{ id: id }, { slug: slug }],
            },
            select: PROJECT_DETAILS_SELECT_FIELDS(),
        });
    } else if (id) {
        data = await prisma.project.findUnique({
            where: {
                id: id,
            },
            select: PROJECT_DETAILS_SELECT_FIELDS(),
        });
    } else {
        data = await prisma.project.findUnique({
            where: {
                slug: slug,
            },
            select: PROJECT_DETAILS_SELECT_FIELDS(),
        });
    }

    return data;
}

export type GetProject_Details_ReturnType = Awaited<ReturnType<typeof GetProject_Details>>;
export async function GetProject_Details(slug?: string, id?: string) {
    if (!slug && !id) throw new Error("Either the project id or slug is required!");

    let Project = await GetData_FromCache<GetProject_Details_FromDb_ReturnType>(PROJECT_DETAILS_CACHE_KEY, slug || id);
    if (!Project) Project = await GetProject_Details_FromDb(slug, id);
    if (!Project) return null;

    await Set_ProjectCache(PROJECT_DETAILS_CACHE_KEY, Project);

    const [Org, ProjectTeam] = await Promise.all([
        Project.organisationId ? GetOrganization_BySlugOrId(undefined, Project.organisationId) : null,
        GetTeam(Project.teamId),
    ]);
    if (!ProjectTeam) return null;

    return Object.assign(Project, { organisation: Org || null, team: ProjectTeam });
}

export type GetManyProjects_Details_ReturnType = Awaited<ReturnType<typeof GetManyProjects_Details>>;
export async function GetManyProjects_Details(ProjectIds: string[]) {
    const Projects = [];
    const _OrgIds = new Set<string>();
    const _TeamIds = new Set<string>();

    const ProjectIds_RetrievedFromCache: string[] = [];

    // Get all the project from cache
    {
        const _cachedDetails_promises = [];
        for (const id of ProjectIds) {
            if (!id) continue;
            _cachedDetails_promises.push(GetData_FromCache<GetProject_Details_FromDb_ReturnType>(PROJECT_DETAILS_CACHE_KEY, id));
        }

        const _cachedDetails = await Promise.all(_cachedDetails_promises);
        for (let i = 0; i < _cachedDetails.length; i++) {
            const _project = _cachedDetails[i];
            if (!_project?.id) continue;

            ProjectIds_RetrievedFromCache.push(_project.id);
            Projects.push(_project);
            if (_project.organisationId) _OrgIds.add(_project.organisationId);
            _TeamIds.add(_project.teamId);
        }
    }

    // Get all non-cached projects
    const RemainingProjectIds = ProjectIds.filter((id) => !ProjectIds_RetrievedFromCache.includes(id));

    const _Db_ProjectItems =
        RemainingProjectIds.length > 0
            ? await prisma.project.findMany({
                  where: {
                      id: {
                          in: RemainingProjectIds,
                      },
                  },
                  select: PROJECT_DETAILS_SELECT_FIELDS(),
              })
            : [];

    // Set cache for all non-cached projects
    {
        const _setCache_promises = [];
        for (const project of _Db_ProjectItems) {
            if (!project?.id) continue;
            _setCache_promises.push(Set_ProjectCache(PROJECT_DETAILS_CACHE_KEY, project));

            Projects.push(project);
            if (project.organisationId) _OrgIds.add(project.organisationId);
            _TeamIds.add(project.teamId);
        }

        await Promise.all(_setCache_promises);
    }

    const [_OrgItems, _TeamItems] = await Promise.all([GetManyOrganizations(Array.from(_OrgIds)), GetManyTeams(Array.from(_TeamIds))]);

    const FormattedProjects = [];
    for (let i = 0; i < Projects.length; i++) {
        const project = Projects[i];
        const _project_team = _TeamItems.find((team) => team?.id === project.teamId);
        if (!_project_team) continue;

        const _project_org = _OrgItems.find((org) => org?.id === project.organisationId);
        FormattedProjects.push(Object.assign(project, { organisation: _project_org || null, team: _project_team }));
    }

    return FormattedProjects;
}

export type GetProject_ListItem_ReturnType = Awaited<ReturnType<typeof GetProject_ListItem_FromDb>>;
async function GetProject_ListItem_FromDb(slug?: string, id?: string) {
    if (!slug && !id) throw new Error("Either the project id or slug is required!");

    let data = undefined;

    if (id && slug) {
        data = await prisma.project.findFirst({
            where: {
                OR: [{ id: id }, { slug: slug }],
            },
            select: PROJECT_LIST_ITEM_SELECT_FIELDS(),
        });
    }
    // Prioritize using id for query over using slugs
    else if (id) {
        data = await prisma.project.findUnique({
            where: {
                id: id,
            },
            select: PROJECT_LIST_ITEM_SELECT_FIELDS(),
        });
    } else {
        data = await prisma.project.findUnique({
            where: {
                slug: slug,
            },
            select: PROJECT_LIST_ITEM_SELECT_FIELDS(),
        });
    }

    return data;
}

export async function GetProject_ListItem(slug?: string, id?: string) {
    if (!slug && !id) throw new Error("Either the project id or slug is required!");

    let Project = await GetData_FromCache<GetProject_ListItem_ReturnType>(PROJECT_LIST_ITEM_CACHE_KEY, slug || id);
    if (!Project) Project = await GetProject_ListItem_FromDb(slug, id);
    if (!Project) return null;

    await Set_ProjectCache(PROJECT_LIST_ITEM_CACHE_KEY, Project);

    const [Org, ProjectTeam] = await Promise.all([
        Project.organisationId ? GetOrganization_BySlugOrId(undefined, Project.organisationId) : null,
        GetTeam(Project.teamId),
    ]);
    if (!ProjectTeam) return null;

    return Object.assign(Project, { organisation: Org || null, team: ProjectTeam });
}

export type GetManyProjects_ListItem_ReturnType = Awaited<ReturnType<typeof GetManyProjects_ListItem>>;
export async function GetManyProjects_ListItem(ids: string[]) {
    const Projects = [];
    const _OrgIds = new Set<string>();
    const _TeamIds = new Set<string>();

    const ProjectIds_RetrievedFromCache: string[] = [];

    // Get all the project from cache
    {
        const _cachedListItems_promises = [];
        for (const id of ids) {
            if (!id) continue;
            _cachedListItems_promises.push(GetData_FromCache<GetProject_ListItem_ReturnType>(PROJECT_LIST_ITEM_CACHE_KEY, id));
        }

        const _cachedListItems = await Promise.all(_cachedListItems_promises);
        for (let i = 0; i < _cachedListItems.length; i++) {
            const _project = _cachedListItems[i];
            if (!_project?.id) continue;

            ProjectIds_RetrievedFromCache.push(_project.id);
            Projects.push(_project);
            if (_project.organisationId) _OrgIds.add(_project.organisationId);
            _TeamIds.add(_project.teamId);
        }
    }

    // Get all non-cached projects
    const RemainingProjectIds = ids.filter((id) => !ProjectIds_RetrievedFromCache.includes(id));
    const _Db_ProjectItems =
        RemainingProjectIds.length > 0
            ? await prisma.project.findMany({
                  where: {
                      id: {
                          in: RemainingProjectIds,
                      },
                  },
                  select: PROJECT_LIST_ITEM_SELECT_FIELDS(),
              })
            : [];

    // Set cache for all non-cached projects
    {
        const _setCache_promises = [];
        for (const project of _Db_ProjectItems) {
            if (!project?.id) continue;
            _setCache_promises.push(Set_ProjectCache(PROJECT_LIST_ITEM_CACHE_KEY, project));

            Projects.push(project);
            if (project.organisationId) _OrgIds.add(project.organisationId);
            _TeamIds.add(project.teamId);
        }

        await Promise.all(_setCache_promises);
    }

    const [_OrgItems, _TeamItems] = await Promise.all([GetManyOrganizations(Array.from(_OrgIds)), GetManyTeams(Array.from(_TeamIds))]);

    const FormattedProjects = [];
    for (let i = 0; i < Projects.length; i++) {
        const project = Projects[i];
        const _project_team = _TeamItems.find((team) => team?.id === project.teamId);
        if (!_project_team) continue;

        const _project_org = _OrgItems.find((org) => org.id === project.organisationId);
        FormattedProjects.push(Object.assign(project, { organisation: _project_org || null, team: _project_team }));
    }

    return FormattedProjects;
}

export async function CreateProject<T extends Prisma.ProjectCreateArgs>(args: Prisma.SelectSubset<T, Prisma.ProjectCreateArgs>) {
    const project = await prisma.project.create(args);
    if (project.organisationId) await Delete_OrganizationCache_All(project.organisationId);

    return project;
}

// ? Update and delete project functions
export async function UpdateProject<T extends Prisma.ProjectUpdateArgs>(args: Prisma.SelectSubset<T, Prisma.ProjectUpdateArgs>) {
    const project = await prisma.project.update(args);
    if (project?.id) await Delete_ProjectCache_All(project.id, project.slug);
    if (isProjectIndexable(project.visibility, project.status)) {
        const shouldUpdateIndex =
            NotUndefined(args.data.gameVersions) ||
            NotUndefined(args.data.loaders) ||
            NotUndefined(args.data.featuredCategories) ||
            NotUndefined(args.data.categories) ||
            NotUndefined(args.data.visibility) ||
            NotUndefined(args.data.status) ||
            NotUndefined(args.data.dateUpdated) ||
            NotUndefined(args.data.downloads) ||
            NotUndefined(args.data.type) ||
            NotUndefined(args.data.iconFileId) ||
            NotUndefined(args.data.organisationId);

        if (shouldUpdateIndex) UpdateProjects_SearchIndex([project.id]);
    }

    return project;
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
    const Project = await prisma.project.delete(args);
    if (Project?.id) await Delete_ProjectCache_All(Project.id, Project.slug);
    if (Project?.organisationId) await Delete_OrganizationCache_All(Project.organisationId);
    if (isProjectIndexable(Project.visibility, Project.status)) await RemoveProjects_FromSearchIndex([Project.id]);

    return Project;
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

    const p1 = SetCache(NAMESPACE, project.id, project.slug, PROJECT_CACHE_EXPIRY_seconds);
    const p2 = SetCache(NAMESPACE, project.slug, json_string, PROJECT_CACHE_EXPIRY_seconds);
    await Promise.all([p1, p2]);
}

// Search index functions
interface IndexCriteriaFields {
    visibility: string;
    status: string;
}

export async function UpdateOrRemoveProject_FromSearchIndex(
    ProjectId: string,
    OldStats: IndexCriteriaFields,
    NewStats: IndexCriteriaFields,
) {
    const wasPreviouslyIndexable = isProjectIndexable(OldStats.visibility, OldStats.status);
    const isNowIndexable = isProjectIndexable(NewStats.visibility, NewStats.status);

    // Remove the project from the search index if it was previously indexable and but is not indexable anymore
    if (wasPreviouslyIndexable && !isNowIndexable) await RemoveProjects_FromSearchIndex([ProjectId]);
    // Add the project to the search index if it was not previously indexable
    else if (!wasPreviouslyIndexable && isNowIndexable) await AddProjects_ToSearchIndex([ProjectId]);
    // Update the project in the search index if it was previously indexable and still is indexable
    else if (wasPreviouslyIndexable && isNowIndexable) await UpdateProjects_SearchIndex([ProjectId]);
}

function NotUndefined<T>(value: T | undefined): boolean {
    return value !== undefined;
}
