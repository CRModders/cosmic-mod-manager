export enum languages {
	en = "en", // English
	es = "es", // Spanish
	fr = "fr", // French
	pt = "pt", // Portuguese

	nn = "nn", // Norwegian Nynorsk
	nb = "nb", // Norwegian Bokmål
	no = "no",
}

export interface locale_meta {
	language: {
		en_name: string;
		locale_name: string;
		code: string;
	};
	region: {
		name: string;
		code: string;
	};
	similar_to?: string[];
}

export interface locale_interface {
	globals: {
		site: {
			full_name: string;
			short_name: string;
		};
		mods: string;
		resource_packs: string;
		modpacks: string;
		shaders: string;
	};

	home_page: {
		hero: {
			description: {
				line_1: string;
				line_2: string;
			};
		};
	};
}
