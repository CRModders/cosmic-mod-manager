import type { ProjectVisibility, ReleaseChannels } from "@root/types";
import type { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
	size?: string;
};

export enum ThemeOptions {
	LIGHT = "light",
	DARK = "dark",
}

export interface UseThemeProps {
	themes?: string[];
	setTheme: (value: string | ((theme: string | undefined) => string)) => void;
	theme?: string | undefined;
}

export type AuthProviderData = {
	provider: string;
	provider_account_email: string;
};

export type ProjectDataType = {
	id: string;
	name: string;
	org_id?: string;
	status: string;
	summary: string;
	type: string;
	updated_on: Date;
	created_on: Date;
	url_slug: string;
	visibility: string;
	members?: {
		role: string;
		role_title: string;
		user: {
			id: string;
			avatar_image?: string;
			user_name: string;
		};
	}[];
};

export type ProjectVersionData = {
	id: string;
	visibility: ProjectVisibility;
	icon: string;
	members: {
		id: string;
		user_id: string;
		role: string;
	}[];

	versions: {
		id: string;
		version_number: string;
		version_title: string;
		changelog: string;
		url_slug: string;
		is_featured: boolean;
		published_on: Date;
		downloads: number;
		release_channel: ReleaseChannels;
		supported_game_versions: string[];
		supported_loaders: string[];
		publisher: {
			id: string;
			role_title: string;
			user: {
				id: string;
				user_name: string;
				avatar_image: string;
			};
		};

		files: {
			id: string;
			file_name: string;
			file_size: number;
			file_type: string;
			file_url: string;
			is_primary: boolean;
		}[];
	}[];
};

export type ProjectVersionsList = {
	id: string;
	visibility: ProjectVisibility;
	icon: string;
	versions: {
		id: string;
		version_number: string;
		version_title: string;
		url_slug: string;
		is_featured: boolean;
		published_on: Date;
		downloads: number;
		release_channel: ReleaseChannels;
		supported_game_versions: string[];
		supported_loaders: string[];

		files: {
			id: string;
			file_name: string;
			file_size: number;
			file_type: string;
			file_url: string;
			is_primary: boolean;
		}[];
	}[];
};
