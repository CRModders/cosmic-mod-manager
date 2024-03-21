import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const sleep = async (timeoutMs = 1_000) => {
	const p = new Promise((resolve) => {
		setTimeout(() => {
			resolve("...");
		}, timeoutMs);
	});

	await p;
};
