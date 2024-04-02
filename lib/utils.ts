import crypto from "crypto";
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

export const shuffleCharacters = (str: string) => {
	const characters = str.split("");
	for (let i = characters.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[characters[i], characters[j]] = [characters[j], characters[i]];
	}
	return characters.join("");
};

type randomCodeGenOptions = {
	length?: number;
	onlyNumbers?: boolean;
};

export const generateRandomCode = ({
	length = 32,
	onlyNumbers = false,
}: randomCodeGenOptions) => {
	return shuffleCharacters(crypto.randomUUID().replaceAll("-", ""));
};
