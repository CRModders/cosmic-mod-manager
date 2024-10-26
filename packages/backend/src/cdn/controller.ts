import prisma from "@/services/prisma";
import { getFile, getFileUrl, getProjectGalleryFile } from "@/services/storage";
import type { ContextUserData, FILE_STORAGE_SERVICE } from "@/types";
import { HTTP_STATUS } from "@/utils/http";
import { versionFileUrl } from "@/utils/urls";
import { getUserIpAddress } from "@src/auth/helpers";
import { isProjectAccessible } from "@src/project/utils";
import type { Context } from "hono";
import { projectMembersSelect } from "../project/queries/project";
import { addToDownloadsQueue } from "./downloads-counter";

export const serveVersionFile = async (
    ctx: Context,
    projectSlug: string,
    versionSlug: string,
    fileName: string,
    userSession: ContextUserData | undefined,
    // True when the client requests for the CDN_URL of the file
    // False means the request is coming from the CACHE CDN itself
    isUserRequest = true,
) => {
    const projectData = await prisma.project.findUnique({
        where: {
            slug: projectSlug,
        },
        select: {
            id: true,
            visibility: true,
            status: true,
            versions: {
                where: {
                    slug: versionSlug,
                },
                select: {
                    id: true,
                    files: true,
                },
            },
            ...projectMembersSelect(),
        },
    });

    const targetVersion = projectData?.versions?.[0];
    if (!projectData?.id || !targetVersion?.files?.[0]?.fileId) {
        return ctx.status(HTTP_STATUS.NOT_FOUND);
    }

    const projectAccessible = isProjectAccessible({
        visibility: projectData.visibility,
        publishingStatus: projectData.status,
        userId: userSession?.id,
        teamMembers: projectData.team?.members || [],
        orgMembers: [],
    });
    if (!projectAccessible) {
        return ctx.json({}, HTTP_STATUS.NOT_FOUND);
    }

    const versionFile = await prisma.file.findFirst({
        where: {
            id: {
                in: targetVersion.files.map((file) => file.fileId),
            },
            name: fileName,
        },
    });
    if (!versionFile?.id) {
        return ctx.json({ message: "File not found" }, HTTP_STATUS.NOT_FOUND);
    }

    // Get corresponding file from version
    const targetVersionFile = targetVersion.files.find((file) => file.fileId === versionFile.id);
    if (isUserRequest && targetVersionFile?.isPrimary === true) {
        // add download count
        await addToDownloadsQueue({
            ipAddress: getUserIpAddress(ctx) || "",
            userId: userSession?.id || ctx.get("guest-session"),
            projectId: projectData.id,
            versionId: targetVersion.id,
        });
    }

    if (isUserRequest) {
        return ctx.redirect(`${versionFileUrl(projectSlug, versionSlug, fileName)}`);
    }

    const file = await getFile(versionFile.storageService as FILE_STORAGE_SERVICE, versionFile.url);
    if (!file) return ctx.json({ message: "File not found" }, HTTP_STATUS.NOT_FOUND);

    if (typeof file === "string") return ctx.redirect(file);

    const response = new Response(file, { status: HTTP_STATUS.OK });
    response.headers.set("Cache-Control", "public, max-age=31536000");
    response.headers.set("Content-Type", file.type);

    return response;
};

export const serveProjectIconFile = async (ctx: Context, slug: string) => {
    const project = await prisma.project.findFirst({
        where: {
            OR: [{ slug: slug }, { id: slug }],
        },
    });
    if (!project?.iconFileId) return ctx.json({}, HTTP_STATUS.NOT_FOUND);

    const iconFileData = await prisma.file.findUnique({
        where: {
            id: project.iconFileId,
        },
    });
    if (!iconFileData?.id) return ctx.json({}, HTTP_STATUS.NOT_FOUND);

    const iconFile = await getFile(iconFileData.storageService as FILE_STORAGE_SERVICE, iconFileData.url);

    // Redirect to the file if it's a URL
    if (typeof iconFile === "string") return ctx.redirect(iconFile);

    const response = new Response(iconFile);
    response.headers.set("Cache-Control", "public, max-age=31536000"); // For a full year
    return response;
};

export const serveProjectGalleryImage = async (ctx: Context, slug: string, image: string) => {
    const project = await prisma.project.findFirst({
        where: {
            OR: [{ slug: slug }, { id: slug }],
        },
        select: {
            id: true,
            gallery: true,
            slug: true,
        },
    });
    if (!project?.gallery?.[0]?.id) return ctx.json({}, HTTP_STATUS.NOT_FOUND);

    const dbFile = await prisma.file.findFirst({
        where: {
            id: {
                in: project.gallery.map((galleryItem) => galleryItem.imageFileId),
            },
            name: image,
        },
    });
    if (!dbFile) return ctx.json({}, HTTP_STATUS.NOT_FOUND);

    // Get the URL of the stored file
    const imageFileUrl = getFileUrl(dbFile.storageService as FILE_STORAGE_SERVICE, dbFile.url, dbFile.name);
    if (!imageFileUrl) return ctx.json({}, HTTP_STATUS.NOT_FOUND);

    // Get the file from the storage service
    const file = await getProjectGalleryFile(dbFile.storageService as FILE_STORAGE_SERVICE, project.id, imageFileUrl);
    if (!file) return ctx.json({}, HTTP_STATUS.NOT_FOUND);

    // If the file is a URL, redirect to it
    if (typeof file === "string") return ctx.redirect(file);

    const response = new Response(file);
    response.headers.set("Cache-Control", "public, max-age=31536000"); // 1 year
    return response;
};
