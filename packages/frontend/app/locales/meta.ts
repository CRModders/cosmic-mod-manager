import { formatLocaleCode } from ".";
import type { LocaleMetaData } from "./types";

const SupportedLocales = [
    meta({
        code: "en",
        name: "English",
        nativeName: "English",
        dir: "ltr",
    }),

    meta({
        code: "es",
        name: "Spanish",
        nativeName: "Español",
        dir: "ltr",
        region: {
            code: "ES",
            name: "Spain",
            displayName: "España",
        },
    }),
        meta({
        code: "es",
        name: "Spanish",
        nativeName: "Español",
        dir: "ltr",
        region: {
            code: "419",
            name: "Latin America",
            displayName: "Latinoamérica",
        },
    }),
];

export default SupportedLocales;
export const DefaultLocale = SupportedLocales[0];

// Helpers
function meta(locale: LocaleMetaData) {
    return locale;
}

export function GetLocaleMetadata(code: string) {
    return SupportedLocales.find((locale) => locale.code === code || formatLocaleCode(locale) === code);
}
