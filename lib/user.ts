import { maxNameLength, maxUsernameLength, minPasswordLength } from "@/config";

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
	const containsAlphabets = /^[a-zA-Z]+$/.test(username);

	if (username.includes(" ")) {
		return "Username cannot contain spaces";
	}

	if (!usernameRegex.test(username)) {
		return "No special character other than underscores( _ ) are allowed";
	}

	if (!containsAlphabets) {
		return "Your username must contain alphabetical characters";
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
	const hasSymbol = /\W/.test(password);

	if (!hasUpperCase && !hasLowerCase) {
		return "Your password must contain an alphabetical character";
	}

	if (!hasNumber) {
		return "Your password must contain a number";
	}

	if (!hasSymbol) {
		return "Your password must contain a special character. (eg @, $, #, %, & etc) ";
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
