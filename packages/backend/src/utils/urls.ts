const CDN_SERVER_URL = process.env.CDN_SERVER_URL;
const CACHE_CDN_URL = process.env.CACHE_CDN_URL;

if (!CDN_SERVER_URL) {
    throw new Error("CDN_SERVER_URL is not set");
}
if (!CACHE_CDN_URL) {
    throw new Error("CACHE_CDN_URL is not set");
}

const CDN_PREFIX = (useCacheCdn?: boolean) => `${useCacheCdn ? CACHE_CDN_URL : CDN_SERVER_URL}/cdn/data`;

export const cdnUrl = (path: string, useCacheCdn = true) => {
    if (!path) return null;
    if (path.startsWith("http")) return path;

    return `${CDN_PREFIX(useCacheCdn)}/${path}${!useCacheCdn ? "?isCdnReq=false" : ""}`;
};

export const projectIconUrl = (slug: string, icon: string, useCacheCdn?: boolean) => {
    if (!icon) return null;
    return cdnUrl(`${slug}/icon`, useCacheCdn);
};

export const projectGalleryFileUrl = (slug: string, galleryFile: string, useCacheCdn?: boolean) => {
    if (galleryFile.startsWith("http")) return galleryFile;
    return cdnUrl(`${slug}/gallery/${encodeURIComponent(galleryFile)}`, useCacheCdn);
};

export const versionFileUrl = (projectSlug: string, versionSlug: string, fileName: string, useCacheCdn?: boolean) => {
    if (fileName.startsWith("http")) return fileName;
    return cdnUrl(`${projectSlug}/version/${versionSlug}/${encodeURIComponent(fileName)}`, useCacheCdn);
};
