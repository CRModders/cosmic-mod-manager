const CDN_SERVER_URL = process.env.CDN_SERVER_URL;

if (CDN_SERVER_URL === undefined) {
    throw new Error("CDN_SERVER_URL is not set");
}

const CDN_PREFIX = `${CDN_SERVER_URL}/cdn/data`;

export const projectIconUrl = (slug: string, icon: string) => {
    return icon ? `${CDN_PREFIX}/${slug}/icon` : null;
};

export const projectGalleryFileUrl = (slug: string, galleryFile: string) => {
    return `${CDN_PREFIX}/${slug}/gallery/${galleryFile}`;
};

export const versionFileUrl = (projectSlug: string, versionSlug: string, fileName: string) => {
    return `${CDN_PREFIX}/${projectSlug}/version/${versionSlug}/${encodeURIComponent(fileName)}`;
};
