import prisma from "@/services/prisma";
import type { ContextUserData } from "@/types";
import type { RouteHandlerResponse } from "@/types/http";
import { HTTP_STATUS, invalidReqestResponseData } from "@/utils/http";
import { STRING_ID_LENGTH } from "@shared/config";
import type { newProjectFormSchema } from "@shared/schemas/project";
import { ProjectPublishingStatus, ProjectSupport } from "@shared/types";
import { nanoid } from "nanoid";
import type { z } from "zod";

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

    const newTeam = await prisma.team.create({
        data: {
            id: nanoid(STRING_ID_LENGTH),
        },
    });

    await prisma.teamMember.create({
        data: {
            id: nanoid(STRING_ID_LENGTH),
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

    const newProject = await prisma.project.create({
        data: {
            id: nanoid(STRING_ID_LENGTH),
            teamId: newTeam.id,
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
