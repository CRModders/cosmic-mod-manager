import { en_gb } from "../en/en-GB";
import { locale_interface, locale_meta } from "../interface";

export const es_es = {
	meta: {
		language: {
			en_name: "Spanish (Spain)",
			locale_name: "Español (España)",
			code: "es",
		},
		region: {
			name: "Spain",
			code: "ES",
		},
	} satisfies locale_meta,

	// By default it is set to british english content, to get away from typescript errors
	content: {
		...en_gb.content,
		home_page: {
			...en_gb.content.home_page,
			hero: {
				description: {
					line_1: "El mejor lugar para tus mods [Cosmic Reach].",
					line_2: "Descubre, juega y crea contenido, todo en un solo lugar.",
				},
			},
		},
	},
} satisfies {
	meta: locale_meta;
	content: locale_interface;
};
