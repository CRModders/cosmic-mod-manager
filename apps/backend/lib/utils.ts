import {
	Loaders,
	ProjectVisibility,
	VersionReleaseChannels,
	ProjectType as db_ProjectType,
	type ProjectMember,
} from "@prisma/client";
import { ReleaseChannels, ProjectType as ts_ProjectType } from "@root/types";

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

export const GetProjectTypeType = (project_type: string): db_ProjectType => {
	switch (project_type) {
		case ts_ProjectType.MOD:
			return db_ProjectType.MOD;

		case ts_ProjectType.MODPACK:
			return db_ProjectType.MODPACK;

		case ts_ProjectType.SHADER:
			return db_ProjectType.SHADER;

		case ts_ProjectType.RESOURCE_PACK:
			return db_ProjectType.RESOURCE_PACK;

		case ts_ProjectType.DATA_PACK:
			return db_ProjectType.DATA_PACK;

		case ts_ProjectType.PLUGIN:
			return db_ProjectType.PLUGIN;

		default:
			return db_ProjectType.MOD;
	}
};

export const GetUsersProjectMembership = (
	currUserId: string | undefined | null,
	membersList: Partial<ProjectMember>[],
) => {
	if (!currUserId) return null;

	for (const member of membersList) {
		if (member?.id && member.user_id === currUserId) {
			return member;
		}
	}

	return null;
};

export const GetProjectVersionReleaseChannel = (releaseChannel: string) => {
	switch (releaseChannel) {
		case ReleaseChannels.RELEASE:
			return VersionReleaseChannels.RELEASE;
		case ReleaseChannels.BETA:
			return VersionReleaseChannels.BETA;
		case ReleaseChannels.ALPHA:
			return VersionReleaseChannels.ALPHA;
		default:
			return VersionReleaseChannels.RELEASE;
	}
};

export const GetProjectLoader = (loader: string) => {
	switch (loader) {
		case "FABRIC":
			return Loaders.FABRIC;
		case "QUILT":
			return Loaders.QUILT;
		case "PUZZLE_LOADER":
			return Loaders.PUZZLE_LOADER;
		default:
			return Loaders.QUILT;
	}
};

export const GetProjectLoadersList = (loaders_list: string[]) => {
	const list: Loaders[] = [];
	for (const loader of loaders_list) {
		const loaderName = GetProjectLoader(loader);
		if (!list.includes(loaderName)) {
			list.push(loaderName);
		}
	}

	return list;
};
