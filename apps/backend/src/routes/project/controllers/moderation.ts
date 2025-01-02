import { RejectedStatuses } from "@app/utils/config/project";
import { getCurrMember } from "@app/utils/project";
import { ProjectPublishingStatus } from "@app/utils/types";
import { GetProject_Details, UpdateProject } from "~/db/project_item";
import type { ContextUserData } from "~/types";
import { HTTP_STATUS, invalidReqestResponseData } from "~/utils/http";

export async function QueueProjectForApproval(projectId: string, userSession: ContextUserData) {
    const project = await GetProject_Details(projectId);
    if (!project?.id) return invalidReqestResponseData("Project not found");

    const memberObj = getCurrMember(userSession.id, project.team.members, project.organisation?.team?.members || []);
    if (!memberObj?.isOwner) return invalidReqestResponseData("Only the owner can submit the project for review!");

    const currDate = new Date();

    // Don't allow resubmission before an interval of 3 hours from rejection
    if (RejectedStatuses.includes(project.status as ProjectPublishingStatus) && project.dateQueued) {
        const timeRemaining = 10800000 - (currDate.getTime() - project.dateQueued.getTime());
        if (timeRemaining > 0) {
            return invalidReqestResponseData(
                `Please wait for ${Math.round(timeRemaining / 60_000)} minutes before trying to resubmit again!`,
            );
        }
    }

    if (project.status !== ProjectPublishingStatus.DRAFT && !RejectedStatuses.includes(project.status as ProjectPublishingStatus)) {
        return invalidReqestResponseData("You cannot request for approval in project's current state!");
    }

    // Check if the project is eligible to be queued for approval
    // If project doesn't have any supported game versions, that means it hasn't uploaded any versions yet
    if (project.gameVersions.length <= 0) return invalidReqestResponseData("Project submitted for approval without any initial versions!");
    if (!project.description?.length) return invalidReqestResponseData("Project submitted for approval without a description!");
    if (!project.licenseId && !project.licenseName) return invalidReqestResponseData("Project submitted for approval without a license!");

    await UpdateProject({
        where: { id: project.id },
        data: {
            status: ProjectPublishingStatus.PROCESSING,
            requestedStatus: ProjectPublishingStatus.APPROVED,
            dateQueued: currDate,
        },
    });

    return {
        data: {
            success: true,
            message: "Project successfully queued for approval! Expect it to be done in 24-48 hours!",
        },
        status: HTTP_STATUS.OK,
    };
}
