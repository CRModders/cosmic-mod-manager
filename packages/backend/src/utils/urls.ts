const CDN_SERVER_URL = process.env.CDN_SERVER_URL;

if (CDN_SERVER_URL === undefined) {
    throw new Error("CDN_SERVER_URL is not set");
}

const CDN_PREFIX = `${CDN_SERVER_URL}/cdn/data`;

export const cdnUrl = (path: string) => {
    if (!path) return null;
    if (path.startsWith("http")) return path;

    return `${CDN_PREFIX}/${path}`;
};

export const projectIconUrl = (slug: string, icon: string) => {
    if (!icon) return null;
    return cdnUrl(`${slug}/icon`);
};

export const projectGalleryFileUrl = (slug: string, galleryFile: string) => {
    if (galleryFile.startsWith("http")) return galleryFile;
    return cdnUrl(`${slug}/gallery/${encodeURIComponent(galleryFile)}`);
};

export const versionFileUrl = (projectSlug: string, versionSlug: string, fileName: string) => {
    if (fileName.startsWith("http")) return fileName;
    return cdnUrl(`${projectSlug}/version/${versionSlug}/${encodeURIComponent(fileName)}`);
};
