const CDN_PREFIX = "/cdn/data";

export const projectIconUrl = (slug: string, icon: string) => {
    return icon ? `${CDN_PREFIX}/${slug}/${icon}` : null;
}

export const projectGalleryFileUrl = (slug: string, fileName: string) => {
    return `${CDN_PREFIX}/${slug}/gallery/${fileName}`;
}

export const versionFileUrl = (projectSlug: string, versionSlug: string, fileName: string) => {
    return `${CDN_PREFIX}/${projectSlug}/version/${versionSlug}/${encodeURIComponent(fileName)}`;
}