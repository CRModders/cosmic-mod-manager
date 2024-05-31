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

// a2`!@$()-_+.,"
const allowedURLCharacters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890`!@$()-_.,"';

export function createURLSafeSlug(slug: string) {
	const result = {
		validInput: false,
		value: "",
	};

	for (const char of slug.replaceAll(" ", "-").toLowerCase()) {
		if (allowedURLCharacters.includes(char)) {
			result.value += char;
		}
	}

	return result;
}
