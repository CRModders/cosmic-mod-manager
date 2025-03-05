import { GetProject_ListItem, UpdateProject } from "~/db/project_item";
import type { ContextUserData } from "~/types";
import { HTTP_STATUS, invalidReqestResponseData, notFoundResponseData } from "~/utils/http";
import { isProjectPublic } from "../utils";
import { GetUser_ByIdOrUsername, UpdateUser } from "~/db/user_item";
import { deleteSessionTokenAndIdCache } from "~/services/cache/session";

export async function addProjectFollower(slug: string, userSession: ContextUserData) {
    const project = await GetProject_ListItem(slug, slug);
    if (!project?.id) return notFoundResponseData("Project not found!");

    if (!isProjectPublic(project.visibility, project.status)) {
        return notFoundResponseData("Project not found!");
    }

    const userData = await GetUser_ByIdOrUsername(undefined, userSession.id);
    if (!userData?.id) return notFoundResponseData("User not found!");

    if (userData.followingProjects.includes(project.id)) return invalidReqestResponseData("Already following project!");

    await Promise.all([
        UpdateUser({
            where: { id: userData.id },
            data: {
                followingProjects: userData.followingProjects.concat(project.id),
            },
        }),

        UpdateProject({
            where: { id: project.id },
            data: {
                followers: {
                    increment: 1,
                },
            },
        }),
    ]);

    return {
        data: {
            success: true,
        },
        status: HTTP_STATUS.OK,
    };
}

export async function removeProjectFollower(slug: string, userSession: ContextUserData) {
    const project = await GetProject_ListItem(slug, slug);
    if (!project?.id) return notFoundResponseData("Project not found!");

    if (!isProjectPublic(project.visibility, project.status)) {
        return notFoundResponseData("Project not found!");
    }

    const userData = await GetUser_ByIdOrUsername(undefined, userSession.id);
    if (!userData?.id) return notFoundResponseData("User not found!");

    if (!userData.followingProjects.includes(project.id)) return invalidReqestResponseData("Not following project!");

    const newFollowsList = [];
    for (let i = 0; i < userData.followingProjects.length; i++) {
        const id = userData.followingProjects[i];
        if (id === project.id) continue;

        newFollowsList.push(id);
    }

    await Promise.all([
        UpdateUser({
            where: { id: userData.id },
            data: {
                followingProjects: newFollowsList,
            },
        }),

        UpdateProject({
            where: { id: project.id },
            data: {
                followers: {
                    decrement: 1,
                },
            },
        }),
    ]);

    return {
        data: {
            success: true,
        },
        status: HTTP_STATUS.OK,
    };
}
