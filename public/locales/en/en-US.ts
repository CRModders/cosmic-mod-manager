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
	},
} satisfies {
	meta: locale_meta;
	content: locale_interface;
};
