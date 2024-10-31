import prisma from "@/services/prisma";
import { getFile, getFileUrl, getProjectGalleryFile } from "@/services/storage";
import type { ContextUserData, FILE_STORAGE_SERVICE } from "@/types";
import { HTTP_STATUS, notFoundResponse } from "@/utils/http";
import { orgIconUrl, projectGalleryFileUrl, projectIconUrl, versionFileUrl } from "@/utils/urls";
import { ProjectVisibility } from "@shared/types";
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
    isCdnRequest = true,
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
        return notFoundResponse(ctx);
    }

    const isProjectPrivate = projectData.visibility === ProjectVisibility.PRIVATE;
    const projectAccessible = isProjectAccessible({
        visibility: projectData.visibility,
        publishingStatus: projectData.status,
        userId: userSession?.id,
        teamMembers: projectData.team.members,
        orgMembers: projectData.organisation?.team.members || [],
    });
    if (!projectAccessible) {
        return notFoundResponse(ctx);
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

    // If the request was not made from the CDN, add the download count
    if (!isCdnRequest && targetVersionFile?.isPrimary === true) {
        // add download count
        await addToDownloadsQueue({
            ipAddress: getUserIpAddress(ctx) || "",
            userId: userSession?.id || ctx.get("guest-session"),
            projectId: projectData.id,
            versionId: targetVersion.id,
        });
    }

    // Redirect to the cdn url if the project is public
    if (!isCdnRequest && !isProjectPrivate) {
        return ctx.redirect(`${versionFileUrl(projectSlug, versionSlug, fileName, true)}`);
    }

    const file = await getFile(versionFile.storageService as FILE_STORAGE_SERVICE, versionFile.url);
    if (!file) return ctx.json({ message: "File not found" }, HTTP_STATUS.NOT_FOUND);

    if (typeof file === "string") return ctx.redirect(file);

    const response = new Response(file, { status: HTTP_STATUS.OK });
    response.headers.set("Cache-Control", "public, max-age=31536000");
    response.headers.set("Content-Type", file.type);

    return response;
};

export const serveProjectIconFile = async (ctx: Context, slug: string, isCdnRequest: boolean) => {
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

    if (!isCdnRequest) {
        return ctx.redirect(`${projectIconUrl(project.slug, project.iconFileId)}`);
    }

    const iconFile = await getFile(iconFileData.storageService as FILE_STORAGE_SERVICE, iconFileData.url);

    // Redirect to the file if it's a URL
    if (typeof iconFile === "string") return ctx.redirect(iconFile);

    const response = new Response(iconFile);
    response.headers.set("Cache-Control", "public, max-age=31536000"); // For a full year
    return response;
};

export const serveProjectGalleryImage = async (ctx: Context, slug: string, image: string, isCdnRequest: boolean) => {
    const project = await prisma.project.findFirst({
        where: {
            OR: [{ slug: slug }, { id: slug }],
        },
        select: {
            id: true,
            gallery: true,
            slug: true,
            visibility: true,
            status: true,
        },
    });
    if (!project || !project?.gallery?.[0]?.id) return notFoundResponse(ctx);

    const dbFile = await prisma.file.findFirst({
        where: {
            id: {
                in: project.gallery.map((galleryItem) => galleryItem.imageFileId),
            },
            name: image,
        },
    });
    if (!dbFile?.name) return notFoundResponse(ctx);

    // If it's not a CDN request redirect to the cache_cdn url
    if (!isCdnRequest) {
        return ctx.redirect(`${projectGalleryFileUrl(project.slug, dbFile.name)}`);
    }

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

export const serveOrgIconFile = async (ctx: Context, slug: string, isCdnRequest: boolean) => {
    const org = await prisma.organisation.findFirst({
        where: {
            OR: [{ slug: slug }, { id: slug }],
        },
    });
    if (!org?.iconFileId) return notFoundResponse(ctx);

    const iconFileData = await prisma.file.findUnique({
        where: {
            id: org.iconFileId,
        },
    });
    if (!iconFileData?.id) return notFoundResponse(ctx);

    if (!isCdnRequest) {
        return ctx.redirect(`${orgIconUrl(org.slug, org.iconFileId)}`);
    }

    const iconFile = await getFile(iconFileData.storageService as FILE_STORAGE_SERVICE, iconFileData.url);

    // Redirect to the file if it's a URL
    if (typeof iconFile === "string") return ctx.redirect(iconFile);

    const response = new Response(iconFile);
    response.headers.set("Cache-Control", "public, max-age=31536000"); // For a full year
    return response;
};
