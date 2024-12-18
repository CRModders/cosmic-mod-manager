export function imageUrl(url: undefined | string | null) {
    if (!url) return "";
    return url;
}

export const isUrl = (str: string) => {
    try {
        new URL(str);

        return true;
    } catch (error) {
        return false;
    }
};
