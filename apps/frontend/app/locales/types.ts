import type en from "~/locales/en/translation";

export interface LocaleMetaData {
    code: string; // es
    name: string; // Spanish
    nativeName: string; // Español
    dir: "ltr" | "rtl";

    // Optional region information (if the locale is regional variant of the language)
    region?: {
        code: string; // ES
        name: string; // Spain
        displayName: string; // España
    };
}

export interface Translation {
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    [key: string]: string | ((...args: any[]) => string) | Translation;
}

export type Locale = typeof en;
