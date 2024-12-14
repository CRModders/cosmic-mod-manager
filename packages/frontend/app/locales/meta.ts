import type { LocaleMetaData } from "./types";

export const en = meta({
    code: "en",
    name: "English",
    nativeName: "English",
    dir: "ltr",
    region: {
        code: "GB",
        name: "United Kingdom",
        displayName: "UK",
    },
});

export const es = meta({
    code: "es",
    name: "Spanish",
    nativeName: "Español",
    dir: "ltr",
    region: {
        code: "ES",
        name: "Spain",
        displayName: "España",
    },
});

const SupportedLocales = [en, es];

export default SupportedLocales;

// Helpers
function meta(locale: LocaleMetaData) {
    return locale;
}

export function GetLocaleMetadata(code: string) {
    return SupportedLocales.find((locale) => locale.code === code);
}
