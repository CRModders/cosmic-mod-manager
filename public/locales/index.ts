import en from "./en";
import es from "./es";
import no from "./no";
import ru from "./ru";

// All the available languages to date
export type available_languages = "en-GB" | "es-ES" | "no-NB" | "no-NN" | "ru-RU";

const locales = {
	default: en.default,
	en: en,
	es: es,
	no: no,
	ru: ru,
};

// Fill missing values in an object from a source object
const updateObject = (srcObj: object, obj: object) => {
	// Return the object as it is if the srcObj itself is null or undefinded or not of object type
	if (!srcObj || typeof srcObj !== "object") return obj;
	const objKeys = Object.keys(srcObj);

	// Loop over each key of the object
	for (const key of objKeys) {
		// If the srcObj[key] value is an object type, recursively pass the value to this function
		if (typeof srcObj[key] === "object") {
			if (obj[key] === undefined || obj[key] === null) obj[key] = {};
			obj[key] = updateObject(srcObj[key], obj[key]);
		}
		// If the value in the obj to be modified is null, set it equal to the value in the srcObj
		else if (obj[key] === null || obj[key] === undefined) {
			obj[key] = srcObj[key];
		}
	}

	// Return the modified object
	return obj;
};

// All teh locales
const localeKeys = Object.keys(locales);

// Get the locale object from lang_code
const getLocaleObj = (lang_code: string) => {
	for (const localeKey of localeKeys) {
		if (localeKey === "default") continue;

		const localeVariants = Object.keys(locales[localeKey]);

		for (const variantKey of localeVariants) {
			if (variantKey === "default") continue;

			if (variantKey === lang_code) {
				return locales[localeKey][variantKey];
			}
		}
	}
};

// Iterate through each locale and fill empty keys with its similar language if available and then using the default language as source
for (const localeKey of localeKeys) {
	// Skip the default
	if (localeKey === "default") continue;

	const localeVariants = Object.keys(locales[localeKey]);

	for (const variantKey of localeVariants) {
		if (variantKey === "default") continue;

		const localeVariantObj = locales[localeKey][variantKey];
		const sourceObj = getLocaleObj(localeVariantObj?.meta?.similar_to);

		// If the localeVariant has a localeVariant similar to it, use that first to replace any null values
		if (sourceObj?.content) {
			localeVariantObj.content = updateObject(sourceObj?.content, localeVariantObj?.content);
		}
		// Use the default localeVariant to replace any undefined | null values remaining there
		localeVariantObj.content = updateObject(locales.default.content, localeVariantObj?.content);
	}
}

export default locales;
