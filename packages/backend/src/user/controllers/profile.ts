import { deleteUserDataCache } from "@/services/cache/session";
import prisma from "@/services/prisma";
import { ListItemProjectFields, projectMembersSelect } from "@/src/project/queries/project";
import { isProjectAccessible } from "@/src/project/utils";
import type { ContextUserData } from "@/types";
import type { RouteHandlerResponse } from "@/types/http";
import { HTTP_STATUS } from "@/utils/http";
import { projectIconUrl } from "@/utils/urls";
import { formatUserName } from "@shared/lib/utils";
import type { profileUpdateFormSchema } from "@shared/schemas/settings";
import { type GlobalUserRole, type ProjectPublishingStatus, ProjectVisibility } from "@shared/types";
import type { ProjectListItem } from "@shared/types/api";
import type { UserProfileData } from "@shared/types/api/user";
import type { z } from "zod";

export async function getUserProfileData(slug: string): Promise<RouteHandlerResponse> {
    const user = await prisma.user.findFirst({
        where: {
            OR: [{ id: slug }, { lowerCaseUserName: slug.toLowerCase() }],
        },
    });

    if (!user) return { data: { success: false, message: "User not found" }, status: HTTP_STATUS.NOT_FOUND };

    const dataObj = {
        id: user.id,
        name: user.name,
        userName: user.userName,
        role: user.role as GlobalUserRole,
        avatarUrl: user.avatarUrl,
        bio: user.bio,
        dateJoined: user.dateJoined,
    } satisfies UserProfileData;

    return { data: dataObj, status: HTTP_STATUS.OK };
}

export async function updateUserProfile(
    userSession: ContextUserData,
    profileData: z.infer<typeof profileUpdateFormSchema>,
): Promise<RouteHandlerResponse> {
    profileData.userName = formatUserName(profileData.userName);
    profileData.name = formatUserName(profileData.name, " ");

    const existingUserWithSameUserName =
        profileData.userName.toLowerCase() === userSession.userName.toLowerCase()
            ? null
            : !!(
                  await prisma.user.findUnique({
                      where: {
                          lowerCaseUserName: profileData.userName.toLowerCase(),
                          NOT: [{ id: userSession.id }],
                      },
                  })
              )?.id;

    if (existingUserWithSameUserName)
        return { data: { success: false, message: "Username already taken" }, status: HTTP_STATUS.BAD_REQUEST };

    let avatarUrl = userSession.avatarUrl;
    if (userSession.avatarUrlProvider !== profileData.avatarUrlProvider) {
        const authAccount = await prisma.authAccount.findFirst({
            where: {
                userId: userSession.id,
                providerName: profileData.avatarUrlProvider,
            },
        });

        if (!authAccount?.id) {
            return { data: { success: false, message: "Invalid profile provider" }, status: HTTP_STATUS.BAD_REQUEST };
        }

        avatarUrl = authAccount?.avatarUrl;
    }

    await prisma.user.update({
        where: {
            id: userSession.id,
        },
        data: {
            name: profileData.name,
            userName: profileData.userName,
            lowerCaseUserName: profileData.userName.toLowerCase(),
            avatarUrlProvider: profileData.avatarUrlProvider,
            avatarUrl: avatarUrl,
        },
    });

    await deleteUserDataCache(userSession.id);
    return { data: { success: true, message: "Profile updated successfully", profileData }, status: HTTP_STATUS.OK };
}

export async function getAllVisibleProjects(
    userSession: ContextUserData | undefined,
    userSlug: string,
    listedProjectsOnly: boolean,
): Promise<RouteHandlerResponse> {
    const user = await prisma.user.findFirst({
        where: {
            OR: [{ id: userSlug }, { lowerCaseUserName: userSlug.toLowerCase() }],
        },
    });
    if (!user) return { data: { success: false, message: "user not found" }, status: HTTP_STATUS.NOT_FOUND };

    const teamProjects = prisma.project.findMany({
        where: {
            team: {
                members: {
                    some: {
                        userId: user.id,
                        accepted: true,
                    },
                },
            },
        },
        select: {
            ...ListItemProjectFields(),
            ...projectMembersSelect(),
        },
    });

    const queryResults = await Promise.all([teamProjects]);
    const allProjects = [...queryResults[0]].toSorted((a, b) => b.downloads - a.downloads);

    if (!allProjects?.length) return { data: [], status: HTTP_STATUS.OK };

    const projectListData: ProjectListItem[] = [];
    for (const project of allProjects) {
        if (!project) continue;

        const isProjectListed = [ProjectVisibility.LISTED, ProjectVisibility.ARCHIVED].includes(project.visibility as ProjectVisibility);
        if (listedProjectsOnly === true && !isProjectListed) continue;

        const projectAccessible = isProjectAccessible({
            visibility: project.visibility as ProjectVisibility,
            publishingStatus: project.status as ProjectPublishingStatus,
            userId: userSession?.id,
            teamMembers: project.team.members,
            orgMembers: project.organisation?.team.members || [],
        });
        if (!projectAccessible) continue;

        projectListData.push({
            id: project.id,
            slug: project.slug,
            name: project.name,
            summary: project.summary,
            type: project.type,
            status: project.status as ProjectPublishingStatus,
            icon: projectIconUrl(project.id, project.iconFileId),
            downloads: project.downloads,
            followers: project.followers,
            dateUpdated: project.dateUpdated,
            datePublished: project.datePublished,
            featuredCategories: project.featuredCategories,
            categories: project.categories,
            gameVersions: project.gameVersions,
            loaders: project.loaders,
            featured_gallery: null,
            color: project.color,
        });
    }

    return { data: projectListData, status: HTTP_STATUS.OK };
}
