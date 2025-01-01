import type { Dependency } from "@prisma/client";
import prisma from "~/services/prisma";
import type { ContextUserData } from "~/types";
import type { RouteHandlerResponse } from "~/types/http";
import { HTTP_STATUS } from "~/utils/http";
import { projectIconUrl } from "~/utils/urls";
import { ListItemProjectFields, projectMemberPermissionsSelect } from "../queries/project";
import { isProjectAccessible } from "../utils";

export async function getProjectDependencies(slug: string, userSession: ContextUserData | undefined): Promise<RouteHandlerResponse> {
    const project = await prisma.project.findFirst({
        where: {
            OR: [{ id: slug }, { slug: slug }],
        },
        select: {
            id: true,
            visibility: true,
            status: true,
            versions: {
                select: {
                    id: true,
                    dependencies: true,
                },
            },
            ...projectMemberPermissionsSelect(),
        },
    });

    if (!project) {
        return { data: { success: false, message: "Project not found" }, status: HTTP_STATUS.NOT_FOUND };
    }

    // CHECK PERMISSIONS
    const projectAccessible = isProjectAccessible({
        visibility: project.visibility,
        publishingStatus: project.status,
        userId: userSession?.id,
        teamMembers: project.team.members,
        orgMembers: project.organisation?.team.members || [],
        sessionUserRole: userSession?.role,
    });
    if (!projectAccessible) {
        return { data: { success: false, message: "Project not found" }, status: HTTP_STATUS.NOT_FOUND };
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
        select: {
            ...ListItemProjectFields(),
        },
    });

    const dependencyVersions = await prisma.version.findMany({
        where: {
            id: {
                in: dependencyVersionIds,
            },
        },
    });

    return {
        data: {
            projects: dependencyProjects.map((project) => {
                return {
                    ...project,
                    icon: projectIconUrl(project.id, project.iconFileId),
                };
            }),
            versions: dependencyVersions,
        },
        status: HTTP_STATUS.OK,
    };
}
