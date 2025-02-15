import { ProjectPublishingStatus, type ProjectVisibility } from "@app/utils/types";
import type { ModerationProjectItem } from "@app/utils/types/api/moderation";
import type { Prisma } from "@prisma/client";
import { GetManyProjects_ListItem, GetProject_ListItem, UpdateOrRemoveProject_FromSearchIndex, UpdateProject } from "~/db/project_item";
import { Log, Log_SubType } from "~/middleware/logger";
import prisma from "~/services/prisma";
import type { ContextUserData } from "~/types";
import { HTTP_STATUS, notFoundResponseData } from "~/utils/http";
import { orgIconUrl, projectIconUrl, userIconUrl } from "~/utils/urls";

export async function getModerationProjects() {
    const _ProjectIds = await prisma.project.findMany({
        where: {
            status: ProjectPublishingStatus.PROCESSING,
        },
        select: {
            id: true,
        },
        // A hard limit of 100 projects
        // TODO: Implement pagination
        take: 100,
    });
    if (!_ProjectIds) return { data: [], status: HTTP_STATUS.OK };

    const _ModerationProjects = await GetManyProjects_ListItem(_ProjectIds.map((p) => p.id));
    const projectsList: ModerationProjectItem[] = [];

    for (const project of _ModerationProjects) {
        if (!project) continue;

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

export async function updateModerationProject(id: string, status: string, userSession: ContextUserData) {
    const Project = await GetProject_ListItem(undefined, id);
    if (!Project) return notFoundResponseData("Project not found");

    if (status === Project?.status) {
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

    const UpdatedProject = await UpdateProject({
        where: { id: id },
        data: updateData,
    });

    // Update the search index
    await UpdateOrRemoveProject_FromSearchIndex(
        Project.id,
        {
            visibility: Project.visibility,
            status: Project.status,
        },
        {
            visibility: UpdatedProject.visibility,
            status: UpdatedProject.status,
        },
    );

    Log(
        `Status of project ${id} updated to ${updatedStatus} from ${Project.status} by ${userSession.id}`,
        undefined,
        Log_SubType.MODERATION,
    );

    return {
        data: {
            success: true,
            message: `Project status updated to: ${updatedStatus}`,
        },
        status: HTTP_STATUS.OK,
    };
}
