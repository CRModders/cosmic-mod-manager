const CDN_SERVER_URL = process.env.CDN_SERVER_URL;

if (!CDN_SERVER_URL) {
    throw new Error("Empty CDN_SERVER_URL value in the backend's .env");
}

const CDN_PREFIX = `${CDN_SERVER_URL}/cdn/data`;

export const projectIconUrl = (slug: string, icon: string) => {
    return icon ? `${CDN_PREFIX}/${slug}/${icon}` : null;
};

export const projectGalleryFileUrl = (slug: string, fileName: string) => {
    return `${CDN_PREFIX}/${slug}/gallery/${fileName}`;
};

export const versionFileUrl = (projectSlug: string, versionSlug: string, fileName: string) => {
    return `${CDN_PREFIX}/${projectSlug}/version/${versionSlug}/${encodeURIComponent(fileName)}`;
};
