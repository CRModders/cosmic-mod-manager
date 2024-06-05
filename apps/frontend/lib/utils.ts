import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const sleep = async (duration = 1000) => {
	await new Promise((resolve) => {
		setTimeout(() => {
			resolve(true);
		}, duration);
	});
};

export const redirectToMessagePage = (
	message: string,
	messageType: "success" | "error" | "neutral" = "neutral",
	linkUrl?: string,
	linkLabel?: string,
) => {
	window.location.href = `${window.location.origin}/message?message=${encodeURIComponent(
		message,
	)}&messageType=${messageType}&linkUrl=${encodeURIComponent(linkUrl || "")}&linkLabel=${encodeURIComponent(
		linkLabel || "",
	)}`;
};

export const constructProjectPageUrl = (type: string, projectUrlSlug: string) => {
	const pathnameFragments = window.location.href.replace(window.location.origin, "").split("/"); // ? Example pathname => /mod/sodium/version/0.1.1?param=param_value
	if (type.toLowerCase()) pathnameFragments[1] = type.toLowerCase();
	if (projectUrlSlug) pathnameFragments[2] = projectUrlSlug;

	return pathnameFragments.join("/");
};

export const constructVersionPageUrl = (versionUrlSlug: string) => {
	const pathnameFragments = window.location.href.replace(window.location.origin, "").split("/");
	if (versionUrlSlug) pathnameFragments[4] = versionUrlSlug;

	return pathnameFragments.join("/");
};
