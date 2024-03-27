import { maxNameLength, maxUsernameLength } from "@/config";

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

export const isValidUsername = (username: string): string | boolean => {
	const usernameRegex = /^[a-zA-Z0-9_-]+$/;

	if (username.includes(" ")) {
		return "Username cannot contain spaces";
	}

	if (!usernameRegex.test(username)) {
		return "Username cannot contain special characters";
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
