import en from "./en/translation";
import SupportedLocales, { DefaultLocale } from "./meta";
import type { Locale, LocaleMetaData } from "./types";
import { fillEmptyKeys } from "./obj-merge";

export async function getLocale(locale: string): Promise<Locale> {
    const localeModule = await getLocaleFile(locale);
    return fillEmptyKeys(localeModule.default, en);
}

export function getLocaleFile(locale: string) {
    switch (parseLocale(locale)) {
        case "es-419":
            return import("./es-419/translation");

        case "ru":
            return import("./ru/translation");

        case "de":
            return import("./de/translation");

        case "ja":
            return import("./ja/translation");

        // case "en":
        default:
            return import("./en/translation");
    }
}

export function parseLocale(code: string) {
    for (const locale of SupportedLocales) {
        const localeCode = formatLocaleCode(locale);
        if (localeCode === code) return localeCode;
        if (locale.code === code) return localeCode;
    }

    return formatLocaleCode(DefaultLocale);
}

export function formatLocaleCode(meta: LocaleMetaData) {
    const region = meta.region;
    if (!region?.code) return meta.code;

    return `${meta.code}-${region.code}`;
}
