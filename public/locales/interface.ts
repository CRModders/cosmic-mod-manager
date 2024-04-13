import { en_gb } from "./en/en-GB";

export interface locale_meta {
	language: {
		en_name: string;
		locale_name: string;
		code: string;
	};
	region: {
		name: string;
		short_name: string;
		code: string;
	};
	similar_to?: string[];
}

export type home_page_locale = typeof en_gb.content.home_page;
export type featured_section_locale = typeof en_gb.content.home_page.featured_section;
export type auth_locale = typeof en_gb.content.auth;
export type globals_locale = typeof en_gb.content.globals;
export type time_past_phrases = typeof en_gb.content.settings_page.sessions_section.time_past_phrases;

export type locale_content_type = typeof en_gb.content;
