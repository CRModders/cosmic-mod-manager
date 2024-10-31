import { getFileUrl } from "@/services/storage";
import type { FILE_STORAGE_SERVICE } from "@/types";
import env from "./env";

const CDN_SERVER_URL = env.CDN_SERVER_URL;
const CACHE_CDN_URL = env.CACHE_CDN_URL;

const CDN_PREFIX = (useCacheCdn?: boolean) => `${useCacheCdn ? CACHE_CDN_URL : CDN_SERVER_URL}/cdn/data`;

export function cdnUrl(path: string, useCacheCdn = true) {
    if (!path) return null;
    if (path.startsWith("http")) return path;

    return `${CDN_PREFIX(useCacheCdn)}/${path}`;
}

export function projectIconUrl(slug: string, icon: string | null) {
    if (!icon) return null;
    // If the icon has a full URL, return it
    if (icon.startsWith("http")) return icon;

    // Otherwise, construct and return the CDN URL
    return cdnUrl(`${slug}/${icon}`);
}

export function projectGalleryFileUrl(slug: string, galleryFile: string) {
    if (galleryFile.startsWith("http")) return galleryFile;
    return cdnUrl(`${slug}/gallery/${encodeURIComponent(galleryFile)}`);
}

export function versionFileUrl(projectSlug: string, versionSlug: string, fileName: string, useCacheCdn?: boolean) {
    if (fileName.startsWith("http")) return fileName;
    return cdnUrl(`${projectSlug}/version/${versionSlug}/${encodeURIComponent(fileName)}`, useCacheCdn);
}

interface FileData {
    name: string;
    url: string;
    storageService: string;
}

export function getAppropriateProjectIconUrl(iconFile: FileData | undefined, projectSlug: string) {
    if (!iconFile) return null;

    const fileUrl = projectIconUrl(
        projectSlug,
        getFileUrl(iconFile.storageService as FILE_STORAGE_SERVICE, iconFile.url, iconFile.name) || "",
    );
    if (!fileUrl) return null;
    return fileUrl;
}

export function getAppropriateGalleryFileUrl(file: FileData | undefined, projectSlug: string) {
    if (!file) return null;
    const fileUrl = projectGalleryFileUrl(projectSlug, getFileUrl(file.storageService as FILE_STORAGE_SERVICE, file.url, file.name) || "");
    if (!fileUrl) return null;
    return fileUrl;
}

// Organization urls
export function orgIconUrl(slug: string, icon: string | null) {
    if (!icon) return null;
    // If the icon has a full URL, return it
    if (icon.startsWith("http")) return icon;

    // Otherwise, construct and return the CDN URL
    return cdnUrl(`organization/${slug}/${icon}`);
}
