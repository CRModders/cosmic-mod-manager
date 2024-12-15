import en from "./en/translation";
import SupportedLocales from "./meta";
import type { Locale } from "./types";
import { fillEmptyKeys } from "./utils";

export async function getLocale(locale: string): Promise<Locale> {
    const localeModule = await getLocaleFile(locale);
    return fillEmptyKeys(localeModule.default, en);
}

export async function getLocaleFile(locale: string) {
    let module = null;

    switch (parseLocale(locale)) {
        case "es":
            module = await import("./es/translation");
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
        if (locale.code === code) return locale.code;
    }

    return "en";
}
