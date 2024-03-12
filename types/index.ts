import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
	size?: string;
};

export type Mod_Item = {
	name: string;
	description: string;
	logo: string;
	author: string;
	downloads: number;
	lastUpdated: Date;
};
