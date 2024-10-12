import type { ContextUserSession } from "@/../types";
import prisma from "@/services/prisma";
import { status } from "@/utils/http";
import { STRING_ID_LENGTH } from "@shared/config";
import type { createOrganisationFormSchema } from "@shared/schemas/organisation";
import type { OrganisationPermission, ProjectPermission } from "@shared/types";
import type { Organisation } from "@shared/types/api";
import type { Context } from "hono";
import { nanoid } from "nanoid";
import type { z } from "zod";

export const getOrganisationById = async (ctx: Context, userSession: ContextUserSession | undefined, slug: string) => {
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
        return ctx.json({ success: false, message: "Organisation not found" }, status.NOT_FOUND);
    }

    return ctx.json(organisation, status.OK);
};

export const getUserOrganisations = async (ctx: Context, userSession: ContextUserSession) => {
    const organisations = await prisma.organisation.findMany({
        where: {
            team: {
                members: {
                    some: {
                        userId: userSession.id,
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
        return ctx.json({ success: false, message: "No organisations found" }, status.NOT_FOUND);
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

    return ctx.json(organisationsList, status.OK);
};

export const createOrganisation = async (
    ctx: Context,
    userSession: ContextUserSession,
    formData: z.infer<typeof createOrganisationFormSchema>,
) => {
    const possiblyExistingOrgWithSameSlug = await prisma.organisation.findUnique({
        where: {
            slug: formData.slug.toLowerCase(),
        },
    });
    if (possiblyExistingOrgWithSameSlug) {
        return ctx.json({ success: false, message: "The slug is already taken" }, status.BAD_REQUEST);
    }

    const newOrganisation = await prisma.organisation.create({
        data: {
            id: nanoid(STRING_ID_LENGTH),
            name: formData.name,
            slug: formData.slug,
            description: formData.description,

            // Create the org team
            team: {
                create: {
                    id: nanoid(STRING_ID_LENGTH),

                    // Create the org owner member
                    members: {
                        create: {
                            id: nanoid(STRING_ID_LENGTH),
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

    return ctx.json({ success: true, slug: newOrganisation.slug }, status.OK);
};
