import type { ContextUserSession } from "@/../types";
import prisma from "@/services/prisma";
import { isProjectAccessibleToCurrSession } from "@/utils";
import { status } from "@/utils/http";
import { projectIconUrl } from "@/utils/urls";
import { isNumber } from "@shared/lib/utils";
import type { OrganisationPermission, ProjectPermission, ProjectPublishingStatus, ProjectSupport, ProjectVisibility } from "@shared/types";
import type { ProjectListItem } from "@shared/types/api";
import type { Context } from "hono";

export const getManyProjects = async (ctx: Context, userSession: ContextUserSession | undefined, projectIds: string[]) => {
    const list = await prisma.project.findMany({
        where: {
            id: {
                in: projectIds,
            },
        },
        include: {
            team: {
                include: {
                    members: true,
                },
            },
        },
    });

    const projectsList: ProjectListItem[] = [];

    for (const project of list) {
        const { team, ...projectData } = project;
        const members = team.members.map((member) => ({
            ...member,
            permissions: member.permissions as ProjectPermission[],
            organisationPermissions: member.permissions as OrganisationPermission[],
        }));
        if (!isProjectAccessibleToCurrSession(project.visibility, project.status, userSession?.id, members)) {
            continue;
        }

        projectsList.push({
            icon: projectIconUrl(project.slug, project.iconFileId),
            id: project.id,
            slug: project.slug,
            name: project.name,
            summary: project.summary,
            type: project.type,
            downloads: project.downloads,
            followers: project.followers,
            dateUpdated: project.dateUpdated,
            datePublished: project.datePublished,
            status: project.status as ProjectPublishingStatus,
            visibility: project.visibility as ProjectVisibility,
            clientSide: project.clientSide as ProjectSupport,
            serverSide: project.serverSide as ProjectSupport,
            featuredCategories: project.featuredCategories,
            categories: project.categories,
            gameVersions: project.gameVersions,
            loaders: project.loaders,
        });
    }

    return ctx.json(projectsList, status.OK);
};

export const getRandomProjects = async (ctx: Context, count: number) => {
    let projectsCount = 20;
    if (isNumber(count) && count > 0 && count <= 100) {
        projectsCount = count;
    }

    const randomProjects: { id: string }[] =
        await prisma.$queryRaw`SELECT id FROM "Project" TABLESAMPLE SYSTEM_ROWS(${projectsCount}) WHERE "visibility" = 'listed';`;

    const idsArray = randomProjects?.map((project) => project.id);
    return await getManyProjects(ctx, undefined, idsArray);
};
