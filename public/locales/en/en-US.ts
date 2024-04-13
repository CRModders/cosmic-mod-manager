import { locale_interface, locale_meta } from "../interface";
import { en_gb } from "./en-GB";

export const en_us = {
	meta: {
		language: {
			en_name: "English",
			locale_name: "English",
			code: "en",
		},
		region: {
			name: "United States",
			code: "US",
		},
		similar_to: [],
	} satisfies locale_meta,

	// By default it is set to british english content, to get away from typescript errors
	content: {
		...en_gb.content,
		globals: {
			...en_gb.content.globals
			site: {
				full_name: "Cosmic Reach Mod Manager",
				short_name: "CRMM",
			},
			mods: "Mods",
			resource_packs: "Resource packs",
			modpacks: "Modpacks",
			shaders: "Shaders",
	},
	home_page: {
		...en_gb.content.home_page,
		hero: {
			description: {
				line_1: "The best place for your [Cosmic Reach] mods.",
				line_2: "Discover , play, and create content, all in one spot.",
			},
		},
	},
} satisfies {
	meta: locale_meta;
	content: locale_interface;
};
