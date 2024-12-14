import en from "./en/translation";
import SupportedLocales from "./meta";
import type { Locale } from "./types";
import { fillEmptyKeys } from "./utils";

export async function getLocale(locale: string): Promise<Locale> {
    const localeModule = await getLocaleFile(parseLocale(locale));
    return fillEmptyKeys(localeModule, en);
}

export function parseLocale(code: string) {
    for (const locale of SupportedLocales) {
        if (locale.code === code) return locale.code;
    }

    return "en";
}

export async function getLocaleFile(locale: string): Promise<Locale> {
    let module = null;

    switch (locale) {
        case "es":
            module = await import("./es/translation");
            break;

        // case "en":
        default:
            return en;
    }

    if (module) return module.default;
    return en;
}
