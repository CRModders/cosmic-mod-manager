import en from "./en/translation";
import SupportedLocales, { DefaultLocale } from "./meta";
import type { Locale, LocaleMetaData } from "./types";
import { fillEmptyKeys } from "./utils";

export async function getLocale(locale: string): Promise<Locale> {
    const localeModule = await getLocaleFile(locale);
    return fillEmptyKeys(localeModule.default, en);
}

export async function getLocaleFile(locale: string) {
    let module = null;

    switch (parseLocale(locale)) {
        case "es-419":
            module = await import("./es-419/translation");
            break;

        case "ru":
            module = await import("./ru/translation");
            break;

        case "de":
            module = await import("./de/translation");
            break;

        case "ja":
            module = await import("./ja/translation");
            break;

        // case "en":
        default:
            module = await import("./en/translation");
            break;
    }

    return module;
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
