import prisma from "@/services/prisma";
import type { ContextUserData } from "@/types";
import type { RouteHandlerResponse } from "@/types/http";
import { HTTP_STATUS, invalidReqestResponseData, notFoundResponseData } from "@/utils/http";
import { generateDbId } from "@/utils/str";
import type { createOrganisationFormSchema } from "@shared/schemas/organisation";
import type { OrganisationPermission, ProjectPermission } from "@shared/types";
import type { Organisation } from "@shared/types/api";
import type { z } from "zod";

export async function getOrganisationById(userSession: ContextUserData | undefined, slug: string): Promise<RouteHandlerResponse> {
    const organisation = await prisma.organisation.findFirst({
        where: {
            OR: [{ id: slug }, { slug: slug }],
        },
        include: {
            team: {
                include: {
                    members: true,
                },
            },
        },
    });
    if (!organisation) {
        return notFoundResponseData("Organisation not found");
    }

    return { data: organisation, status: HTTP_STATUS.OK };
}

export async function getUserOrganisations(userSession: ContextUserData | undefined, userId: string): Promise<RouteHandlerResponse> {
    const organisations = await prisma.organisation.findMany({
        where: {
            team: {
                members: {
                    some: {
                        userId: userId,
                    },
                },
            },
        },
        include: {
            team: {
                include: {
                    members: {
                        include: {
                            user: true,
                        },
                    },
                },
            },
        },
    });
    if (!organisations) {
        return { data: [], status: HTTP_STATUS.OK };
    }

    const organisationsList: Organisation[] = [];
    for (const org of organisations) {
        organisationsList.push({
            id: org.id,
            teamId: org.teamId,
            name: org.name,
            slug: org.slug,
            description: org.description,
            icon: org.icon,
            members: org.team.members.map((member) => ({
                id: member.id,
                userId: member.userId,
                teamId: member.teamId,
                userName: member.user.userName,
                avatarUrl: member.user.avatarUrl,
                role: member.role,
                isOwner: member.isOwner,
                accepted: member.accepted,
                permissions: member.permissions as ProjectPermission[],
                organisationPermissions: member.organisationPermissions as OrganisationPermission[],
            })),
        });
    }

    return { data: organisationsList, status: HTTP_STATUS.OK };
}

export const createOrganisation = async (userSession: ContextUserData, formData: z.infer<typeof createOrganisationFormSchema>) => {
    const possiblyExistingOrgWithSameSlug = await prisma.organisation.findUnique({
        where: {
            slug: formData.slug.toLowerCase(),
        },
    });
    if (possiblyExistingOrgWithSameSlug) {
        return invalidReqestResponseData("Organisation with the same slug already exists");
    }

    const newOrganisation = await prisma.organisation.create({
        data: {
            id: generateDbId(),
            name: formData.name,
            slug: formData.slug,
            description: formData.description,

            // Create the org team
            team: {
                create: {
                    id: generateDbId(),

                    // Create the org owner member
                    members: {
                        create: {
                            id: generateDbId(),
                            userId: userSession.id,
                            role: "Owner",
                            isOwner: true,
                            accepted: true,
                            dateAccepted: new Date(),
                        },
                    },
                },
            },
        },
    });

    return { data: { success: true, slug: newOrganisation.slug }, status: HTTP_STATUS.OK };
};
