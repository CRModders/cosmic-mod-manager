import { ThemeOptions } from "~/types";

export function getCookie(key: string, src: string) {
    for (const cookie of src.split("; ")) {
        if (cookie.split("=")[0] === key) {
            return cookie.split("=")[1];
        }
    }
    return null;
}

export function setCookie(key: string, value: string, expires = 365) {
    document.cookie = `${key}=${value}; expires=${new Date(Date.now() + expires * 24 * 60 * 60 * 1000).toUTCString()}; path=/`;
}

export function getThemeFromCookie(cookie?: string | null): ThemeOptions {
    return cookie === ThemeOptions.LIGHT ? ThemeOptions.LIGHT : ThemeOptions.DARK;
}
