import type { ContextUserSession } from "@/../types";
import prisma from "@/services/prisma";
import { inferProjectType, isProjectAccessibleToCurrSession } from "@/utils";
import httpCode from "@/utils/http";
import { getAppropriateProjectIconUrl } from "@/utils/urls";
import type { Dependency } from "@prisma/client";
import type { ProjectPermission } from "@shared/types";
import type { Context } from "hono";
import { getFilesFromId } from "./utils";

export const getProjectDependencies = async (ctx: Context, slug: string, userSession: ContextUserSession | undefined) => {
    const project = await prisma.project.findFirst({
        where: {
            OR: [{ id: slug }, { slug: slug }],
        },
        select: {
            id: true,
            visibility: true,
            status: true,
            team: {
                select: {
                    members: {
                        where: { userId: userSession?.id || "" },
                        select: {
                            id: true,
                            userId: true,
                            permissions: true,
                        },
                    },
                },
            },
            organisation: {
                select: {
                    team: {
                        select: {
                            members: {
                                where: { userId: userSession?.id || "" },
                                select: {
                                    id: true,
                                    userId: true,
                                    permissions: true,
                                },
                            },
                        },
                    },
                },
            },
            versions: {
                select: {
                    id: true,
                    dependencies: true,
                },
            },
        },
    });

    if (!project) {
        return ctx.json({ success: false, message: "Project not found" }, httpCode("not_found"));
    }

    // CHECK PERMISSIONS
    const members = (project.team.members || []).map((member) => ({
        id: member.id,
        userId: member.userId,
        permissions: member.permissions as ProjectPermission[],
    }));

    if (project?.organisation?.team?.members) {
        for (const member of project.organisation.team.members) {
            members.push({
                id: member.id,
                userId: member.userId,
                permissions: member.permissions as ProjectPermission[],
            });
        }
    }

    if (!isProjectAccessibleToCurrSession(project.visibility, project.status, userSession?.id, members)) {
        return ctx.json({ success: false, message: "Project not found" }, httpCode("not_found"));
    }

    // Aggregate all dependencies
    const dependencies: Dependency[] = [];
    for (const version of project.versions) {
        if (version.dependencies) {
            for (const dependency of version.dependencies) {
                dependencies.push(dependency);
            }
        }
    }

    // Separate dependencies into project-level and version-level
    const dependencyProjectIds: string[] = [];
    const dependencyVersionIds: string[] = [];

    for (const dependency of dependencies) {
        dependencyProjectIds.push(dependency.projectId);

        if (dependency.versionId) {
            dependencyVersionIds.push(dependency.versionId);
        }
    }

    const dependencyProjects = await prisma.project.findMany({
        where: {
            id: {
                in: dependencyProjectIds,
            },
        },
    });

    const dependencyVersions = await prisma.version.findMany({
        where: {
            id: {
                in: dependencyVersionIds,
            },
        },
    });

    const iconFileIds = [];
    for (const project of dependencyProjects) {
        if (project.iconFileId) iconFileIds.push(project.iconFileId);
    }
    const projectIconFiles = await getFilesFromId(iconFileIds);

    return ctx.json(
        {
            projects: dependencyProjects.map((project) => {
                const iconFile = projectIconFiles.get(project?.iconFileId || "");

                return {
                    ...project,
                    icon: getAppropriateProjectIconUrl(iconFile, project.slug),
                    type: inferProjectType(project.loaders),
                };
            }),
            versions: dependencyVersions,
        },
        httpCode("ok"),
    );
};
