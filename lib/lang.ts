import locales from "@/public/locales";
import type { availableLocalesListData, locale_content_type, locale_meta } from "@/public/locales/interface";

const default_language = {
	code: locales.default.meta.language.code,
	region: locales.default.meta.region.code,
};

// const lang_code_exceptions = ["nn-NO", "nb-NO"];

type formatted_lang = {
	lang_code: string;
	base_lang: string;
	region?: string;
};
export const format_lang_code = (lang_code: string | null): formatted_lang => {
	if (lang_code) {
		try {
			const base_lang = lang_code.split("-")[0]?.slice(0, 2).toLowerCase();
			const region = lang_code.split("-")[1]?.slice(0, 2).toUpperCase();

			const code = `${base_lang}-${region}`;

			if (!region || region?.length < 2) {
				return {
					lang_code: base_lang,
					base_lang: base_lang,
				};
			}
			return {
				lang_code: code,
				base_lang: base_lang,
				region: region,
			};
		} catch (error) {}
	}
	return {
		lang_code: default_language.code,
		base_lang: default_language.code,
		region: default_language.region,
	};
};

export const get_available_lang_code = (language_code: string | null): formatted_lang => {
	const { lang_code, base_lang, region } = format_lang_code(language_code);

	try {
		// Check if the language is available, if not the default language will be returned;
		const locale_lang = locales[base_lang];

		if (locale_lang) {
			const regional_locale = locale_lang[lang_code];
			if (regional_locale) {
				return {
					lang_code: lang_code,
					base_lang: base_lang,
					region: region,
				};
			}

			const default_locale_region: string = locale_lang.default.meta.region.code;
			return {
				lang_code: `${base_lang}-${default_locale_region}`,
				base_lang: base_lang,
				region: default_locale_region,
			};
		}
	} catch (error) {}

	return {
		lang_code: `${default_language.code}-${default_language.region}`,
		base_lang: default_language.code,
		region: default_language.region,
	};
};

export const get_locale = (
	code: string | null,
): {
	meta: locale_meta;
	content: locale_content_type;
} => {
	const available_lang = get_available_lang_code(code);
	const locale_data = locales[available_lang.base_lang][available_lang.lang_code];

	return locale_data;
};

type extracted_elems = {
	strings: string[];
	links?: string[];
};

const identifiers = {
	link_text: {
		start: "[",
		end: "]",
	},
};

const separator = "&pipes;";

const contains_elems = (str: string) => {
	const identifiers_list = Object.values(identifiers);
	let result = false;

	for (const identifier of identifiers_list) {
		if (str.split("").includes(identifier.start)) {
			result = true;
			break;
		}
	}
	return result;
};

const extract_links = (str: string) => {
	if (str.includes(identifiers.link_text.start)) {
		const result = [];
		let str_ref = str;

		while (true) {
			const start_index = str_ref.indexOf(identifiers.link_text.start);
			const terminating_index = str_ref.indexOf(identifiers.link_text.end);
			if (start_index && terminating_index === -1) {
				throw new Error(`Unterminated ']' character in string : \n ${str}`);
			}

			const link_text = str_ref.slice(start_index + 1, terminating_index);
			result.push(link_text);
			str_ref = str_ref.slice(terminating_index + 1, str_ref.length);
			if (!str_ref || !str_ref.includes(identifiers.link_text.start)) break;
		}

		return result;
	}

	return null;
};

const get_regular_str_parts = (str: string) => {
	if (!contains_elems(str)) {
		return [str];
	}
	const identifiers_list = Object.values(identifiers);
	let str_ref = str;
	for (const identifier of identifiers_list) {
		while (true) {
			const start_index = str_ref.indexOf(identifier.start);
			const terminating_index = str_ref.indexOf(identifier.end);
			if (start_index && terminating_index === -1) {
				throw new Error(`Unterminated ']' character in string : \n ${str}`);
			}

			str_ref = `${str_ref.slice(0, start_index)}${separator}${str_ref.slice(terminating_index + 1)}`;
			if (!str_ref.includes(identifier.start)) break;
		}
	}
	return str_ref.split(separator);
};

export const extract_elems = (str: string): extracted_elems => {
	const result = {
		strings: [],
		links: [],
	} satisfies extracted_elems;

	if (!contains_elems(str)) {
		return {
			...result,
			strings: [str],
		};
	}

	const link_texts = extract_links(str);
	if (link_texts) {
		result.links = link_texts;
	}

	const str_parts = get_regular_str_parts(str);
	result.strings = str_parts;
	return result;
};

export const getAvailableLocales = () => {
	const languages: availableLocalesListData[] = [];
	for (const langName of Object.keys(locales)) {
		if (langName !== "default") {
			const regionalLocales = locales[langName];

			for (const localeCode of Object.keys(regionalLocales)) {
				const localeMeta: locale_meta = regionalLocales[localeCode].meta;
				// const localeMeta = locales.en["en-GB"].meta;

				if (localeCode !== "default") {
					languages.push({
						code: localeCode,
						en_name: localeMeta.language.en_name,
						locale_name: localeMeta.language.locale_name,
						region: localeMeta.region.display_name,
					});
				}
			}
		}
	}

	return languages;
};
