import type { ContextUserSession } from "@/../types";
import prisma from "@/services/prisma";
import { isProjectAccessibleToCurrSession } from "@/utils";
import httpCode from "@/utils/http";
import type { ProjectPermissions } from "@shared/types";
import type { Context } from "hono";
import { requiredVersionFields } from "./version";

export const getProjectDependencies = async (ctx: Context, slug: string, userSession: ContextUserSession | undefined) => {
    const project = await prisma.project.findFirst({
        where: {
            OR: [
                { id: slug },
                { slug: slug }
            ]
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
                            permissions: true
                        }
                    }
                }
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
                                    permissions: true
                                }
                            }
                        }
                    }
                }
            },
            versions: {
                select: {
                    id: true,
                    dependencies: {
                        select: {
                            id: true,
                            dependencyType: true,
                            dependencyProject: true,
                            dependencyVersion: {
                                select: requiredVersionFields
                            }
                        }
                    }
                }
            },
        }
    });

    if (!project) {
        return ctx.json({ success: false, message: "Project not found" }, httpCode("not_found"));
    };

    // CHECK PERMISSIONS
    const members = (project.team.members || []).map((member) => ({
        id: member.id,
        userId: member.userId,
        permissions: member.permissions as ProjectPermissions[]
    }));

    if (project?.organisation?.team?.members) {
        for (const member of project.organisation.team.members) {
            members.push({
                id: member.id,
                userId: member.userId,
                permissions: member.permissions as ProjectPermissions[]
            });
        }
    };

    if (!isProjectAccessibleToCurrSession(project.visibility, project.status, userSession?.id, members)) {
        return ctx.json({ success: false, message: "Project not found" }, httpCode("not_found"));
    };

    return ctx.json({ project }, httpCode("ok"));
}