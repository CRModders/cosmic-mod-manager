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
			avatar_image?: string;
			user_name: string;
		};
	}[];
};
