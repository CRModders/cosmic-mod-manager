import { formatLocaleCode } from ".";
import type { LocaleMetaData } from "./types";

const SupportedLocales: LocaleMetaData[] = [
    {
        code: "en",
        name: "English",
        nativeName: "English",
        dir: "ltr",
    },

    {
        code: "es",
        name: "Spanish",
        nativeName: "Español",
        dir: "ltr",
        region: {
            code: "419",
            name: "Latin America",
            displayName: "Latinoamérica",
        },
    },

    {
        code: "ru",
        name: "Russian",
        nativeName: "Русский",
        dir: "ltr",
    },

    {
        code: "de",
        name: "German",
        nativeName: "Deutsch",
        dir: "ltr",
    },

    {
        code: "ja",
        name: "Japanese",
        nativeName: "日本語",
        dir: "ltr",
    },
];

export default SupportedLocales;
export const DefaultLocale = SupportedLocales[0];

export function GetLocaleMetadata(code: string) {
    return SupportedLocales.find((locale) => locale.code === code || formatLocaleCode(locale) === code);
}
