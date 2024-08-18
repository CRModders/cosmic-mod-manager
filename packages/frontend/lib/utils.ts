import { SERVER_URL } from "@/src/hooks/fetch";
import { CapitalizeAndFormatString, createURLSafeSlug } from "@shared/lib/utils";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const getCookie = (key: string) => {
    for (const cookie of document.cookie.split("; ")) {
        if (cookie.split("=")[0] === key) {
            return cookie.split("=")[1];
        }
    }
    return null;
};

export const isCurrLinkActive = (url: string, pathname?: string, exactEnds = true) => {
    if (exactEnds === true) {
        return (pathname || window.location.pathname).endsWith(url);
    }
    return (pathname || window.location.pathname).includes(url);
};

export const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
];

export const timeSince = (pastTime: Date): string => {
    try {
        const now = new Date();
        const diff = now.getTime() - pastTime.getTime();
        const seconds = Math.abs(diff / 1000);
        const minutes = Math.round(seconds / 60);
        const hours = Math.round(minutes / 60);
        const days = Math.round(hours / 24);
        const weeks = Math.round(days / 7);
        const months = Math.round(days / 30.4375);
        const years = Math.round(days / 365.25);

        if (seconds < 60) {
            return "just now";
        }
        if (minutes < 60) {
            return minutes === 1 ? "a minute ago" : `${minutes} minutes ago`;
        }
        if (hours < 24) {
            return hours === 1 ? "an hour ago" : `${hours} hours ago`;
        }
        if (days < 7) {
            return days === 1 ? "a day ago" : `${days} days ago`;
        }
        if (weeks < 4) {
            return weeks === 1 ? "a week ago" : `${weeks} weeks ago`;
        }
        if (months < 12) {
            return months === 1 ? "a month ago" : `${months} months ago`;
        }
        return years === 1 ? "a year ago" : `${years} years ago`;
    } catch (error) {
        console.error(error);
        return "";
    }
};

export const formatDate = (date: Date, timestamp_template = "${month} ${day}, ${year} at ${hours}:${minutes} ${amPm}"): string => {
    try {
        const year = date.getFullYear();
        const monthIndex = date.getMonth();
        const month = monthNames[monthIndex];
        const day = date.getDate();

        const hours = date.getHours();
        const minutes = date.getMinutes();
        const amPm = hours >= 12 ? "PM" : "AM";
        const adjustedHours = hours % 12 || 12; // Convert to 12-hour format

        const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes.toString();

        return timestamp_template
            .replace("${month}", `${month}`)
            .replace("${day}", `${day}`)
            .replace("${year}", `${year}`)
            .replace("${hours}", `${adjustedHours}`)
            .replace("${minutes}", `${formattedMinutes}`)
            .replace("${amPm}", `${amPm}`);
    } catch (error) {
        console.error(error);
        return "";
    }
};

export const getProjectPagePathname = (type: string, projectSlug: string) => {
    return `/${type}/${projectSlug}`;
};

export const getProjectVersionPagePathname = (type: string, projectSlug: string, versionSlug: string) => {
    return `${getProjectPagePathname(type, projectSlug)}/version/${versionSlug}`;
};

export const constructProjectPageUrl = (type: string, projectUrlSlug: string) => {
    const pathnameFragments = window.location.href.replace(window.location.origin, "").split("/"); // ? Example pathname => /mod/sodium/version/0.1.1?param=param_value
    if (type.toLowerCase()) pathnameFragments[1] = createURLSafeSlug(type).value;
    if (projectUrlSlug) pathnameFragments[2] = projectUrlSlug;

    return pathnameFragments.join("/");
};

export const constructVersionPageUrl = (versionUrlSlug: string) => {
    const pathnameFragments = window.location.href.replace(window.location.origin, "").split("/");
    if (versionUrlSlug) pathnameFragments[4] = versionUrlSlug;

    return pathnameFragments.join("/");
};

export const FormatProjectTypes = (types: string[]) => {
    if (types.length === 1) return CapitalizeAndFormatString(types[0]);
    if (types.length === 2) return `${CapitalizeAndFormatString(types[0])} and ${CapitalizeAndFormatString(types[1])}`;

    let str = "";
    for (const type of types.slice(0, -2)) {
        str += `${CapitalizeAndFormatString(type)}, `;
    }

    str += `${CapitalizeAndFormatString(types.at(-2))} and ${CapitalizeAndFormatString(types.at(-1))}`;
    return str;
};


export const projectFileUrl = (pathname: string) => {
    return `${SERVER_URL}${pathname}`;
}

export const imageUrl = (pathname: string | undefined | null) => {
    if (!pathname) return "";
    const dev = import.meta.env.PUBLIC_ENV === "development";
    const directUrl = projectFileUrl(pathname);
    return dev ? directUrl : `https://wsrv.nl/?url=${encodeURIComponent(directUrl)}`;
};
