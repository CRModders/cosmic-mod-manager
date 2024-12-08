import { deleteUserDataCache } from "@/services/cache/session";
import prisma from "@/services/prisma";
import { deleteUserFile, saveUserFile } from "@/services/storage";
import { ListItemProjectFields, projectMembersSelect } from "@/src/project/queries/project";
import { isProjectAccessible } from "@/src/project/utils";
import { type ContextUserData, FILE_STORAGE_SERVICE } from "@/types";
import type { RouteHandlerResponse } from "@/types/http";
import { HTTP_STATUS, notFoundResponseData } from "@/utils/http";
import { resizeImageToWebp } from "@/utils/images";
import { generateDbId } from "@/utils/str";
import { projectIconUrl, userIconUrl } from "@/utils/urls";
import { ICON_WIDTH } from "@shared/config/forms";
import { formatUserName } from "@shared/lib/utils";
import { getFileType } from "@shared/lib/utils/convertors";
import type { profileUpdateFormSchema } from "@shared/schemas/settings";
import { FileType, type GlobalUserRole, type ProjectPublishingStatus, ProjectVisibility } from "@shared/types";
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
                lowerCaseUserName: profileData.userName.toLowerCase(),
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
            lowerCaseUserName: profileData.userName.toLowerCase(),
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
    if (typeof avatarFile === "string") return avatarFile;
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

    let saveIconFileType = fileType;
    const saveIcon = await resizeImageToWebp(avatarFile, fileType, ICON_WIDTH);
    if (fileType !== FileType.GIF) saveIconFileType = FileType.WEBP;

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
