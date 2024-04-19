import type { available_languages } from ".";
import type { en_gb } from "./en/en-GB";

export interface locale_meta {
	language: {
		code: string; // Two letter code of that base language -> (lowercase)
		en_name: string; // English name of the language -> (Normal writing)
		locale_name: string; // Name of the language in that language -> (Normal writing)
	};
	region: {
		code: string; // Two letter code of that region -> (UPPERCASE)
		name: string; // Name of the region (should be written in the language it is being used for) -> (Normal writing)
		display_name: string; // Any shorter name of the region if exists else it will be same as region code  (UPPERCASE)
	};
	similar_to?: available_languages;
}

export type home_page_locale = typeof en_gb.content.home_page;
export type featured_section_locale = typeof en_gb.content.home_page.featured_section;
export type auth_locale = typeof en_gb.content.auth;
export type globals_locale = typeof en_gb.content.globals;
export type time_past_phrases = typeof en_gb.content.settings_page.sessions_section.time_past_phrases;

export type locale_content_type = typeof en_gb.content;

export type locale_variant_object = {
	meta: locale_meta;
	content: locale_content_type;
};
