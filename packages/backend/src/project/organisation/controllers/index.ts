import prisma from "@/services/prisma";
import type { ContextUserData } from "@/types";
import type { RouteHandlerResponse } from "@/types/http";
import { HTTP_STATUS, invalidReqestResponseData, notFoundResponseData } from "@/utils/http";
import { generateDbId } from "@/utils/str";
import { orgIconUrl, projectIconUrl, userIconUrl } from "@/utils/urls";
import { getCurrMember } from "@shared/lib/utils";
import type { createOrganisationFormSchema } from "@shared/schemas/organisation";
import {
    type OrganisationPermission,
    type ProjectPermission,
    type ProjectPublishingStatus,
    type ProjectSupport,
    ProjectVisibility,
} from "@shared/types";
import type { Organisation, ProjectListItem } from "@shared/types/api";
import { ListItemProjectFields, projectMemberPermissionsSelect, teamMembersSelect } from "@src/project/queries/project";
import { isProjectAccessible } from "@src/project/utils";
import type { z } from "zod";

export async function getOrganisationById(userSession: ContextUserData | undefined, slug: string): Promise<RouteHandlerResponse> {
    const organisation = await prisma.organisation.findFirst({
        where: {
            OR: [{ id: slug }, { slug: slug }],
        },
        include: {
            team: {
                select: {
                    members: {
                        ...teamMembersSelect(),
                    },
                },
            },
        },
    });
    if (!organisation) {
        return notFoundResponseData("Organisation not found");
    }
    const currMember = getCurrMember(userSession?.id, [], organisation.team.members);
    const isMember = currMember?.accepted === true;

    const formattedData = {
        id: organisation.id,
        teamId: organisation.teamId,
        name: organisation.name,
        slug: organisation.slug,
        icon: orgIconUrl(organisation.id, organisation.iconFileId),
        description: organisation.description,
        members: organisation.team.members.map((member) => {
            return {
                id: member.id,
                userId: member.userId,
                teamId: member.teamId,
                userName: member.user.userName,
                avatar: userIconUrl(member.user.id, member.user.avatar),
                role: member.role,
                isOwner: member.isOwner,
                accepted: member.accepted,
                permissions: (isMember ? member.permissions : []) as ProjectPermission[],
                organisationPermissions: (isMember ? member.organisationPermissions : []) as OrganisationPermission[],
            };
        }),
    } satisfies Organisation;

    return { data: formattedData, status: HTTP_STATUS.OK };
}

export async function getUserOrganisations(userSession: ContextUserData | undefined, userSlug: string): Promise<RouteHandlerResponse> {
    let userId = userSlug.toLowerCase() === userSession?.userName.toLowerCase() ? userSession.id : null;
    if (!userId) {
        const user = await prisma.user.findFirst({
            where: {
                OR: [
                    { id: userSlug },
                    {
                        userName: {
                            equals: userSlug,
                            mode: "insensitive",
                        },
                    },
                ],
            },
        });

        if (!user) {
            return notFoundResponseData("User not found");
        }
        userId = user.id;
    }

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
        const currMember = getCurrMember(userSession?.id, [], org.team.members);

        organisationsList.push({
            id: org.id,
            teamId: org.teamId,
            name: org.name,
            slug: org.slug,
            description: org.description,
            icon: orgIconUrl(org.id, org.iconFileId),
            members: org.team.members.map((member) => ({
                id: member.id,
                userId: member.userId,
                teamId: member.teamId,
                userName: member.user.userName,
                avatar: userIconUrl(member.user.id, member.user.avatar),
                role: member.role,
                isOwner: member.isOwner,
                accepted: member.accepted,
                permissions: (currMember?.accepted === true ? member.permissions : []) as ProjectPermission[],
                organisationPermissions: (currMember?.accepted === true ? member.organisationPermissions : []) as OrganisationPermission[],
            })),
        });
    }

    return { data: organisationsList, status: HTTP_STATUS.OK };
}

export async function createOrganisation(
    userSession: ContextUserData,
    formData: z.infer<typeof createOrganisationFormSchema>,
): Promise<RouteHandlerResponse> {
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
}

export async function getOrganisationProjects(
    userSession: ContextUserData | undefined,
    slug: string,
    listedOnly = false,
): Promise<RouteHandlerResponse> {
    const org = await prisma.organisation.findFirst({
        where: {
            OR: [{ id: slug }, { slug: slug }],
        },
        include: {
            projects: {
                select: {
                    ...ListItemProjectFields(),
                    ...projectMemberPermissionsSelect(),
                },
            },
        },
    });
    if (!org) {
        return notFoundResponseData("Organisation not found");
    }
    if (!org.projects) {
        return { data: [], status: HTTP_STATUS.OK };
    }

    const formattedProjects: ProjectListItem[] = [];
    for (const project of org.projects) {
        if (listedOnly && project.visibility !== ProjectVisibility.LISTED) continue;

        const projectAccessible = isProjectAccessible({
            visibility: project.visibility,
            publishingStatus: project.status,
            userId: userSession?.id,
            teamMembers: project.team.members,
            orgMembers: project.organisation?.team.members || [],
        });
        if (!projectAccessible) continue;

        formattedProjects.push({
            id: project.id,
            slug: project.slug,
            name: project.name,
            summary: project.summary,
            type: project.type,
            icon: projectIconUrl(project.id, project.iconFileId),
            downloads: project.downloads,
            followers: project.followers,
            dateUpdated: project.dateUpdated,
            datePublished: project.datePublished,
            featuredCategories: project.featuredCategories,
            categories: project.categories,
            gameVersions: project.gameVersions,
            loaders: project.loaders,
            status: project.status as ProjectPublishingStatus,
            visibility: project.visibility as ProjectVisibility,
            clientSide: project.clientSide as ProjectSupport,
            serverSide: project.serverSide as ProjectSupport,
            featured_gallery: null,
            color: project.color,
        });
    }

    return { data: formattedProjects, status: HTTP_STATUS.OK };
}
