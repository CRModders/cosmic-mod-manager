import { en_gb } from "../en/en-GB";
import { locale_interface, locale_meta } from "../interface";

export const es_es = {
	meta: {
		language: {
			en_name: "Spanish (Latin America)",
			locale_name: "Español (América Latina)",
			code: "419",
		},
		region: {
			name: "Latin America",
			code: "419",
		},
	} satisfies locale_meta,

	// By default it is set to british english content, to get away from typescript errors
	content: {
		...en_gb.content,
		home_page: {
			...en_gb.content.home_page,
			hero: {
				description: {
					line_1: "El mejor lugar para pbulicar tus mods de [Cosmic Reach].",
					line_2: "Descubre, juega y crea contenido, todo en un solo lugar.",
				},
			},
		},
	},
} satisfies {
	meta: locale_meta;
	content: locale_interface;
};
