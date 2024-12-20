import { doesOrgMemberHaveAccess } from "@app/utils/project";
import type { z } from "@app/utils/schemas";
import type { newProjectFormSchema } from "@app/utils/schemas/project";
import { OrganisationPermission, ProjectPublishingStatus, ProjectSupport } from "@app/utils/types";
import prisma from "~/services/prisma";
import type { ContextUserData } from "~/types";
import type { RouteHandlerResponse } from "~/types/http";
import { HTTP_STATUS, invalidReqestResponseData, unauthorizedReqResponseData } from "~/utils/http";
import { generateDbId } from "~/utils/str";

export async function createNewProject(
    userSession: ContextUserData,
    formData: z.infer<typeof newProjectFormSchema>,
): Promise<RouteHandlerResponse> {
    const existingProjectWithSameUrl = await prisma.project.findUnique({
        where: {
            slug: formData.slug,
        },
    });
    if (existingProjectWithSameUrl?.id) return invalidReqestResponseData("Url slug already taken");

    let orgId: string | null = null;
    if (formData.orgId) {
        const org = await prisma.organisation.findUnique({
            where: {
                id: formData.orgId,
            },
            select: {
                id: true,
                team: {
                    select: {
                        members: {
                            where: {
                                userId: userSession.id,
                                accepted: true,
                            },
                        },
                    },
                },
            },
        });
        if (!org) return invalidReqestResponseData("Organisation not found");
        orgId = org.id;

        const currMember = org.team.members.find((member) => member.userId === userSession.id);
        const canAddProject = doesOrgMemberHaveAccess(
            OrganisationPermission.ADD_PROJECT,
            currMember?.organisationPermissions as OrganisationPermission[],
            currMember?.isOwner,
            userSession?.role,
        );
        if (!canAddProject) return unauthorizedReqResponseData("You do not have permission to add project to this organisation");
    }

    const newTeam = await prisma.team.create({
        data: {
            id: generateDbId(),
        },
    });

    // If this not an organisation project, add the user in project team as owner
    // else the org owner will be project owner
    if (!orgId) {
        await prisma.teamMember.create({
            data: {
                id: generateDbId(),
                teamId: newTeam.id,
                userId: userSession.id,
                role: "Owner",
                isOwner: true,
                // Owner does not need to have explicit permissions
                permissions: [],
                organisationPermissions: [],
                accepted: true,
                dateAccepted: new Date(),
            },
        });
    }

    const newProject = await prisma.project.create({
        data: {
            id: generateDbId(),
            teamId: newTeam.id,
            organisationId: orgId || null,
            name: formData.name,
            slug: formData.slug,
            type: formData.type,
            summary: formData.summary,
            visibility: formData.visibility,
            status: ProjectPublishingStatus.DRAFT,
            clientSide: ProjectSupport.UNKNOWN,
            serverSide: ProjectSupport.UNKNOWN,
        },
    });

    return {
        data: { success: true, message: "Successfully created new project", urlSlug: newProject.slug, type: newProject.type },
        status: HTTP_STATUS.OK,
    };
}