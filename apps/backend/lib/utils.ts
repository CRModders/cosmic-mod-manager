import { ProjectVisibility } from "@prisma/client";

export const shuffleCharacters = (str: string) => {
	const characters = str.split("");
	for (let i = characters.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[characters[i], characters[j]] = [characters[j], characters[i]];
	}
	return characters.join("");
};

export const generateRandomCode = (length = 32) => {
	let result = shuffleCharacters(crypto.randomUUID().replaceAll("-", ""));
	while (result.length < length) {
		result += shuffleCharacters(crypto.randomUUID().replaceAll("-", ""));
	}

	return shuffleCharacters(result.slice(0, length));
};

export const Capitalize = (str: string) => {
	if (!str) return str;
	return `${str[0].toUpperCase()}${str.slice(1)}`;
};

export const GetProjectVisibilityType = (visibility): ProjectVisibility => {
	switch (visibility) {
		case ProjectVisibility.PUBLIC:
			return ProjectVisibility.PUBLIC;
		case ProjectVisibility.PRIVATE:
			return ProjectVisibility.PRIVATE;
		case ProjectVisibility.UNLISTED:
			return ProjectVisibility.UNLISTED;
		default:
			return ProjectVisibility.PUBLIC;
	}
};
