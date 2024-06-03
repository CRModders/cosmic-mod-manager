import {
	Loaders,
	ProjectVisibility,
	VersionReleaseChannels,
	ProjectType as db_ProjectType,
	type ProjectMember,
} from "@prisma/client";
import { createURLSafeSlug } from "@root/lib/utils";
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
		case createURLSafeSlug(ts_ProjectType.MOD).value:
			return db_ProjectType.MOD;

		case ts_ProjectType.MODPACK:
		case createURLSafeSlug(ts_ProjectType.MODPACK).value:
			return db_ProjectType.MODPACK;

		case ts_ProjectType.SHADER:
		case createURLSafeSlug(ts_ProjectType.SHADER).value:
			return db_ProjectType.SHADER;

		case ts_ProjectType.RESOURCEPACK:
		case createURLSafeSlug(ts_ProjectType.RESOURCEPACK).value:
			return db_ProjectType.RESOURCEPACK;

		case ts_ProjectType.DATAPACK:
		case createURLSafeSlug(ts_ProjectType.DATAPACK).value:
			return db_ProjectType.DATAPACK;

		case ts_ProjectType.PLUGIN:
		case createURLSafeSlug(ts_ProjectType.PLUGIN).value:
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
		case "Fabric":
			return Loaders.FABRIC;
		case "Quilt":
			return Loaders.QUILT;
		default:
			return Loaders.QUILT;
	}
};

export const GetProjectLoadersList = (loaders_list: string[]) => {
	const list: Loaders[] = [];
	for (const loader of loaders_list) {
		list.push(GetProjectLoader(loader));
	}

	return list;
};
