import { ICON_WIDTH } from "@app/utils/config/constants";
import { getFileType } from "@app/utils/convertors";
import type { profileUpdateFormSchema } from "@app/utils/schemas/settings";
import { formatUserName } from "@app/utils/string";
import { type GlobalUserRole, type ProjectPublishingStatus, ProjectVisibility } from "@app/utils/types";
import type { ProjectListItem } from "@app/utils/types/api";
import type { UserProfileData } from "@app/utils/types/api/user";
import type { z } from "zod";
import { ListItemProjectFields, projectMembersSelect } from "~/routes/project/queries/project";
import { isProjectAccessible } from "~/routes/project/utils";
import { deleteUserDataCache } from "~/services/cache/session";
import prisma from "~/services/prisma";
import { deleteUserFile, saveUserFile } from "~/services/storage";
import { type ContextUserData, FILE_STORAGE_SERVICE } from "~/types";
import type { RouteHandlerResponse } from "~/types/http";
import { HTTP_STATUS, notFoundResponseData } from "~/utils/http";
import { resizeImageToWebp } from "~/utils/images";
import { generateDbId } from "~/utils/str";
import { projectIconUrl, userIconUrl } from "~/utils/urls";

export async function getUserProfileData(slug: string): Promise<RouteHandlerResponse> {
    const user = await prisma.user.findFirst({
        where: {
            OR: [
                { id: slug },
                {
                    userName: {
                        equals: slug,
                        mode: "insensitive",
                    },
                },
            ],
        },
    });

    if (!user) return { data: { success: false, message: "User not found" }, status: HTTP_STATUS.NOT_FOUND };

    const dataObj = {
        id: user.id,
        name: user.name,
        userName: user.userName,
        role: user.role as GlobalUserRole,
        avatar: userIconUrl(user.id, user.avatar),
        bio: user.bio,
        dateJoined: user.dateJoined,
    } satisfies UserProfileData;

    return { data: dataObj, status: HTTP_STATUS.OK };
}

export async function updateUserProfile(
    userSession: ContextUserData,
    profileData: z.infer<typeof profileUpdateFormSchema>,
): Promise<RouteHandlerResponse> {
    const user = await prisma.user.findUnique({
        where: {
            id: userSession.id,
        },
    });
    if (!user) return notFoundResponseData("User not found");

    profileData.userName = formatUserName(profileData.userName);

    // If the user is trying to change their username, check if the new username is available
    if (profileData.userName.toLowerCase() !== user.userName.toLowerCase()) {
        const existingUserWithSameUserName = await prisma.user.findFirst({
            where: {
                userName: {
                    equals: profileData.userName,
                    mode: "insensitive",
                },
                NOT: [{ id: user.id }],
            },
        });
        if (existingUserWithSameUserName) {
            return { data: { success: false, message: "Username already taken" }, status: HTTP_STATUS.BAD_REQUEST };
        }
    }

    const avatarFileId = await getUserAvatar(user.id, user.avatar, profileData.avatar);

    await prisma.user.update({
        where: {
            id: user.id,
        },
        data: {
            avatar: avatarFileId,
            userName: profileData.userName,
            bio: profileData.bio,
        },
    });

    await deleteUserDataCache(user.id);
    return { data: { success: true, message: "Profile updated successfully", profileData }, status: HTTP_STATUS.OK };
}

export async function getUserAvatar(
    userId: string,
    prevAvatarId: string | null,
    avatarFile?: null | string | File,
): Promise<string | null> {
    if (typeof avatarFile === "string") return prevAvatarId;
    // If the user didn't upload a new avatar, return the previous avatar
    if (!avatarFile) return prevAvatarId;

    try {
        if (prevAvatarId) {
            const deletedDbFile = await prisma.file.delete({ where: { id: prevAvatarId } });
            await deleteUserFile(deletedDbFile.storageService as FILE_STORAGE_SERVICE, userId, deletedDbFile.name);
        }
    } catch {}

    const fileType = await getFileType(avatarFile);
    if (!fileType) return null;

    const [saveIcon, saveIconFileType] = await resizeImageToWebp(avatarFile, fileType, {
        width: ICON_WIDTH,
        height: ICON_WIDTH,
        fit: "cover",
    });

    const fileId = `${generateDbId()}_${ICON_WIDTH}.${saveIconFileType}`;
    const iconSaveUrl = await saveUserFile(FILE_STORAGE_SERVICE.LOCAL, userId, saveIcon, fileId);
    if (!iconSaveUrl) return null;

    await prisma.file.create({
        data: {
            id: fileId,
            name: fileId,
            size: avatarFile.size,
            type: fileType,
            url: iconSaveUrl,
            storageService: FILE_STORAGE_SERVICE.LOCAL,
        },
    });

    return fileId;
}

export async function getAllVisibleProjects(userSession: ContextUserData | undefined, userSlug: string, listedProjectsOnly: boolean) {
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
    if (!user) return { data: { success: false, message: "user not found" }, status: HTTP_STATUS.NOT_FOUND };

    const projects = await prisma.project.findMany({
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

    const allProjects = projects.toSorted((a, b) => b.downloads - a.downloads);

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
            sessionUserRole: userSession?.role,
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
            visibility: project.visibility as ProjectVisibility,
        });
    }

    return { data: projectListData, status: HTTP_STATUS.OK };
}
