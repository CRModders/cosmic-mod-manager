import { ProjectPublishingStatus, type ProjectVisibility } from "@app/utils/types";
import type { ModerationProjectItem } from "@app/utils/types/api/moderation";
import type { Prisma } from "@prisma/client";
import prisma from "~/services/prisma";
import { HTTP_STATUS } from "~/utils/http";
import { orgIconUrl, projectIconUrl, userIconUrl } from "~/utils/urls";

export async function getModerationProjects() {
    const projects = await prisma.project.findMany({
        where: {
            status: ProjectPublishingStatus.PROCESSING,
        },
        include: {
            organisation: {
                select: {
                    id: true,
                    slug: true,
                    name: true,
                    iconFileId: true,
                },
            },
            team: {
                select: {
                    members: {
                        where: { isOwner: true },
                        select: {
                            user: {
                                select: {
                                    id: true,
                                    userName: true,
                                    avatar: true,
                                },
                            },
                        },
                    },
                },
            },
        },
        orderBy: {
            dateQueued: "asc",
        },
    });

    const projectsList: ModerationProjectItem[] = [];

    for (const project of projects) {
        let author: ModerationProjectItem["author"] | undefined = undefined;
        if (project.organisation?.slug) {
            const org = project.organisation;

            author = {
                name: org.name,
                slug: org.slug,
                icon: orgIconUrl(org.id, org.iconFileId),
                isOrg: true,
            };
        } else {
            const owner = project.team.members[0].user;
            author = {
                name: owner.userName,
                slug: owner.userName,
                icon: userIconUrl(owner.id, owner.avatar),
                isOrg: false,
            };
        }

        projectsList.push({
            id: project.id,
            slug: project.slug,
            name: project.name,
            summary: project.summary,
            type: project.type,
            icon: projectIconUrl(project.id, project.iconFileId),
            downloads: project.downloads,
            followers: project.followers,
            dateQueued: project.dateQueued as Date,
            status: project.status as ProjectPublishingStatus,
            requestedStatus: project.requestedStatus as ProjectPublishingStatus,
            visibility: project.visibility as ProjectVisibility,
            author: author,
        });
    }

    return {
        data: projectsList,
        status: HTTP_STATUS.OK,
    };
}

export async function updateModerationProject(id: string, status: string) {
    const project = await prisma.project.findUnique({
        where: {
            id: id,
        },
        select: {
            status: true,
            requestedStatus: true,
        },
    });

    if (status === project?.status) {
        return {
            data: {
                success: false,
                message: `The project status is already '${status}'`,
            },
            status: HTTP_STATUS.OK,
        };
    }

    let updatedStatus = ProjectPublishingStatus.DRAFT;
    if (status === ProjectPublishingStatus.APPROVED) updatedStatus = ProjectPublishingStatus.APPROVED;
    if (status === ProjectPublishingStatus.REJECTED) updatedStatus = ProjectPublishingStatus.REJECTED;
    if (status === ProjectPublishingStatus.WITHHELD) updatedStatus = ProjectPublishingStatus.WITHHELD;

    const updateData: Prisma.ProjectUpdateInput = {};
    if (updatedStatus === ProjectPublishingStatus.APPROVED) {
        updateData.dateQueued = null;
        updateData.dateApproved = new Date();
        updateData.requestedStatus = null;
        updateData.status = updatedStatus;
    } else {
        updateData.status = updatedStatus;
        updateData.requestedStatus = null;
    }

    await prisma.project.update({
        where: { id: id },
        data: updateData,
    });

    return {
        data: {
            success: true,
            message: `Project status updated to: ${updatedStatus}`,
        },
        status: HTTP_STATUS.OK,
    };
}
