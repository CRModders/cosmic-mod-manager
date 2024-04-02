//     This file is part of Cosmic Reach Mod Manager.
//
//    Cosmic Reach Mod Manager is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
//
//    Cosmic Reach Mod Manager is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
//
//   You should have received a copy of the GNU General Public License along with Cosmic Reach Mod Manager. If not, see <https://www.gnu.org/licenses/>.

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
