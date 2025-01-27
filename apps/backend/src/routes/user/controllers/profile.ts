import { ICON_WIDTH } from "@app/utils/config/constants";
import { getFileType } from "@app/utils/convertors";
import type { profileUpdateFormSchema } from "@app/utils/schemas/settings";
import { formatUserName } from "@app/utils/string";
import { FileType, type GlobalUserRole, type ProjectPublishingStatus, ProjectVisibility } from "@app/utils/types";
import type { ProjectListItem } from "@app/utils/types/api";
import type { UserProfileData } from "@app/utils/types/api/user";
import type { z } from "zod";
import { CreateFile, DeleteFile_ByID } from "~/db/file_item";
import { GetManyProjects_ListItem } from "~/db/project_item";
import { GetUser_ByIdOrUsername, GetUser_Unique, Get_UserProjects, UpdateUser } from "~/db/user_item";
import { isProjectAccessible } from "~/routes/project/utils";
import { UpdateProjects_SearchIndex } from "~/routes/search/search-db";
import { deleteUserDataCache } from "~/services/cache/session";
import { deleteUserFile, saveUserFile } from "~/services/storage";
import { type ContextUserData, FILE_STORAGE_SERVICE } from "~/types";
import { HTTP_STATUS, notFoundResponseData } from "~/utils/http";
import { resizeImageToWebp } from "~/utils/images";
import { generateDbId } from "~/utils/str";
import { projectIconUrl, userIconUrl } from "~/utils/urls";

export async function getUserProfileData(slug: string) {
    const user = await GetUser_ByIdOrUsername(slug, slug);
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

export async function updateUserProfile(userSession: ContextUserData, profileData: z.infer<typeof profileUpdateFormSchema>) {
    const user = await GetUser_Unique({
        where: {
            id: userSession.id,
        },
    });
    if (!user) return notFoundResponseData("User not found");

    profileData.userName = formatUserName(profileData.userName);

    // If the user is trying to change their username, check if the new username is available
    if (profileData.userName.toLowerCase() !== user.userName.toLowerCase()) {
        const existingUserWithSameUserName = await GetUser_ByIdOrUsername(profileData.userName);
        if (existingUserWithSameUserName) {
            return { data: { success: false, message: "Username already taken" }, status: HTTP_STATUS.BAD_REQUEST };
        }

        // Update project's search index so that the new username is reflected
        const UserProjects_Id = await Get_UserProjects(user.id);
        if (UserProjects_Id.length) UpdateProjects_SearchIndex(UserProjects_Id);
    }

    const avatarFileId = await getUserAvatar(user.id, user.avatar, profileData.avatar);

    await UpdateUser({
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
            const deletedDbFile = await DeleteFile_ByID(prevAvatarId);
            await deleteUserFile(deletedDbFile.storageService as FILE_STORAGE_SERVICE, userId, deletedDbFile.name);
        }
    } catch {}

    const uploadedImg_Type = await getFileType(avatarFile);
    if (!uploadedImg_Type) return null;

    const savedImg_Type = FileType.WEBP;
    const profileImg_Webp = await resizeImageToWebp(avatarFile, uploadedImg_Type, {
        width: ICON_WIDTH,
        height: ICON_WIDTH,
        fit: "cover",
    });

    const imgFile_Id = `${generateDbId()}_${ICON_WIDTH}.${savedImg_Type}`;
    const img_SaveUrl = await saveUserFile(FILE_STORAGE_SERVICE.LOCAL, userId, profileImg_Webp, imgFile_Id);
    if (!img_SaveUrl) return null;

    await CreateFile({
        data: {
            id: imgFile_Id,
            name: imgFile_Id,
            size: profileImg_Webp.size,
            type: savedImg_Type,
            url: img_SaveUrl,
            storageService: FILE_STORAGE_SERVICE.LOCAL,
        },
    });

    return imgFile_Id;
}

export async function getAllVisibleProjects(userSession: ContextUserData | undefined, userSlug: string, listedProjectsOnly: boolean) {
    const user = await GetUser_ByIdOrUsername(userSlug, userSlug);
    if (!user) return { data: { success: false, message: "user not found" }, status: HTTP_STATUS.NOT_FOUND };

    const UserProjects_Id = await Get_UserProjects(user.id);
    if (!UserProjects_Id.length) return { data: [], status: HTTP_STATUS.OK };

    const UserProjects = await GetManyProjects_ListItem(UserProjects_Id);
    UserProjects.sort((a, b) => b.downloads - a.downloads);

    const projectListData: ProjectListItem[] = [];
    for (const project of UserProjects) {
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
