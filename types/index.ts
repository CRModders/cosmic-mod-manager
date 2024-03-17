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

export enum ContentCategories {
	mod = "mod",
	resourcePack = "resourcepack",
	shader = "shader",
	modpack = "modpack",
}

export type FeaturedSectionItem = {
	name: string;
	description: string;
	logo: string;
	url: string;
};

export type FeaturedSectionContentData = {
	categoryName: ContentCategories;
	title: string;
	items: FeaturedSectionItem[];
}[];
