//     This file is part of Cosmic Reach Mod Manager.
//
//    Cosmic Reach Mod Manager is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
//
//    Cosmic Reach Mod Manager is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
//
//   You should have received a copy of the GNU General Public License along with Cosmic Reach Mod Manager. If not, see <https://www.gnu.org/licenses/>.

import { maxNameLength, maxUsernameLength, minPasswordLength } from "@/config";
import { Providers } from "@prisma/client";

export const parseName = (name: string) => {
	if (name.length > maxNameLength) {
		return name.slice(0, maxNameLength - 1);
	}
	return name;
};

export const parseUserName = (username: string) => {
	if (username.length > maxUsernameLength) {
		return username.slice(0, maxUsernameLength - 1).toLowerCase();
	}
	return username.toLowerCase();
};

export const parseUsername = (username: string): string => {
	return encodeURIComponent(username).replaceAll("-", "_").toLowerCase();
};

export const isValidUsername = (username: string): string | boolean => {
	const usernameRegex = /^[a-zA-Z0-9_]+$/;

	if (username.includes(" ")) {
		return "Username cannot contain spaces";
	}

	if (!usernameRegex.test(username)) {
		return "No special character other than underscore( _ ) is allowed";
	}

	return true;
};

export const isValidName = (username: string): string | boolean => {
	const nameRegex = /^[a-zA-Z0-9_ -]+$/;

	if (!nameRegex.test(username.replaceAll(" ", ""))) {
		return "Your name cannot contain special characters";
	}

	return true;
};

export const isValidPassword = (password: string): boolean | string => {
	const minLength = 8;
	const hasUpperCase = /[A-Z]/.test(password);
	const hasLowerCase = /[a-z]/.test(password);
	const hasNumber = /\d/.test(password);

	if (!hasUpperCase && !hasLowerCase) {
		return "Your password must contain an alphabetical character";
	}

	if (!hasNumber) {
		return "Your password must contain a number";
	}

	if (password.length < minLength) {
		return `Your password must be ${minPasswordLength} characters long`;
	}

	return true;
};

export const isValidEmail = (email: string): boolean => {
	const emailRegex =
		/^(?=.{1,256}$)[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:(?=[a-zA-Z0-9-]{1,63}\.)(?!-)[a-zA-Z0-9-]{1,63}(?<!-)\.?)+(?:[a-zA-Z]{2,})$/;
	return emailRegex.test(email);
};

export const parseProfileProvider = (provider: string): Providers | null => {
	if (provider === "google") return Providers.google;
	if (provider === "discord") return Providers.discord;
	if (provider === "github") return Providers.github;
	if (provider === "gitlab") return Providers.gitlab;
	return null;
};
