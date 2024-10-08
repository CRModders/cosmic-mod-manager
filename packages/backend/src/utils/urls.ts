import type { FILE_STORAGE_SERVICE } from "@/../types";
import { getFileUrl } from "@/services/storage";

const CDN_SERVER_URL = process.env.CDN_SERVER_URL;
const CACHE_CDN_URL = process.env.CACHE_CDN_URL;

if (!CDN_SERVER_URL) {
    throw new Error("CDN_SERVER_URL is not set");
}
if (!CACHE_CDN_URL) {
    throw new Error("CACHE_CDN_URL is not set");
}

const CDN_PREFIX = (useCacheCdn?: boolean) => `${useCacheCdn ? CACHE_CDN_URL : CDN_SERVER_URL}/cdn/data`;

export const cdnUrl = (path: string, useCacheCdn = true, redirectToCacheCdnIfUsingServerUrl = true) => {
    if (!path) return null;
    if (path.startsWith("http")) return path;

    return `${CDN_PREFIX(useCacheCdn)}/${path}${!useCacheCdn && redirectToCacheCdnIfUsingServerUrl ? "?isCdnReq=false" : ""}`;
};

export const projectIconUrl = (slug: string, icon: string | null) => {
    if (!icon) return null;
    if (icon.startsWith("http")) return icon;

    return cdnUrl(`${slug}/${icon}`);
};

export const projectGalleryFileUrl = (slug: string, galleryFile: string) => {
    if (galleryFile.startsWith("http")) return galleryFile;
    return cdnUrl(`${slug}/gallery/${encodeURIComponent(galleryFile)}`);
};

export const versionFileUrl = (
    projectSlug: string,
    versionSlug: string,
    fileName: string,
    useCacheCdn?: boolean,
    redirectToCacheCdnIfUsingServerUrl?: boolean,
) => {
    if (fileName.startsWith("http")) return fileName;
    return cdnUrl(`${projectSlug}/version/${versionSlug}/${encodeURIComponent(fileName)}`, useCacheCdn, redirectToCacheCdnIfUsingServerUrl);
};

interface FileData {
    name: string;
    url: string;
    storageService: string;
}

export const getAppropriateProjectIconUrl = (iconFile: FileData | undefined, projectSlug: string) => {
    if (!iconFile) return null;
    const fileUrl = projectIconUrl(
        projectSlug,
        getFileUrl(iconFile.storageService as FILE_STORAGE_SERVICE, iconFile.url, iconFile.name) || "",
    );
    if (!fileUrl) return null;
    return fileUrl;
};

export const getAppropriateGalleryFileUrl = (File: FileData | undefined, projectSlug: string) => {
    if (!File) return null;
    const fileUrl = projectGalleryFileUrl(projectSlug, getFileUrl(File.storageService as FILE_STORAGE_SERVICE, File.url, File.name) || "");
    if (!fileUrl) return null;
    return fileUrl;
};
