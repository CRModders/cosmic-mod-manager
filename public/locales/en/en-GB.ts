import { locale_interface, locale_meta } from "../interface";

export const en_gb = {
	meta: {
		language: {
			en_name: "English",
			locale_name: "English",
			code: "en",
		},
		region: {
			name: "UK",
			code: "GB",
		},
	} satisfies locale_meta,

	content: {
		globals: {
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
			hero: {
				description: {
					line_1: "The best place for your [Cosmic Reach] mods.",
					line_2: "Discover, play, and create content, all in one spot.",
				},
			},
		},
	},
} satisfies {
	meta: locale_meta;
	content: locale_interface;
};
