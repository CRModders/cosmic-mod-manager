import { disableInteractions, enableInteractions } from "@root/utils/dom";
import { prepend, removeLeading, removeTrailing, usePathname, useUrlLocale } from "@root/utils/urls";
import { type ReactNode, createContext, use, useState } from "react";
import type { NavigateFunction } from "react-router";
import { getLocale, parseLocale } from ".";
import en from "./en/translation";
import { GetLocaleMetadata, en as en_Metadata } from "./meta";
import type { Locale, LocaleMetaData } from "./types";

interface LocaleContext {
    locale: LocaleMetaData;
    t: Locale;
    changeLocale: (locale: string, navigate?: NavigateFunction) => void;
}
const LocaleContext = createContext<LocaleContext>({
    locale: en_Metadata,
    t: en,
    changeLocale: (locale: string, navigate?: NavigateFunction) => {},
});

export function LocaleProvider({ children, initLocale, initMetadata }: Props) {
    const [locale, setLocale] = useState(initLocale);
    const [localeMetadata, setLocaleMetadata] = useState(initMetadata || en_Metadata);

    function formatUrl(locale: LocaleMetaData) {
        // Get the current pathname
        const pathname = usePathname();
        // Get the current locale prefix and prepend a slash in front of it
        const currLocalePrefix = prepend("/", useUrlLocale());

        // Change the prefix based on the new locale
        const newPrefix = locale.code === "en" ? "" : locale.code;

        // Remove the current locale prefix from the pathname
        const pathnameWithoutLocale = prepend("/", removeLeading(currLocalePrefix, pathname));

        // Prepend the new locale prefix to the pathname, and remove any trailing slashes
        return removeTrailing("/", prepend(newPrefix, pathnameWithoutLocale));
    }

    async function changeLocale(locale: string, navigate?: NavigateFunction) {
        disableInteractions();

        if (navigate) {
            const newLangMetadata = GetLocaleMetadata(locale);
            const newUrl = formatUrl(newLangMetadata || en_Metadata);
            navigate(newUrl, { preventScrollReset: true });
        }

        setLocale(await getLocale(locale));
        setLocaleMetadata(GetLocaleMetadata(parseLocale(locale)) || en_Metadata);

        enableInteractions();
    }

    return (
        <LocaleContext
            value={{
                locale: localeMetadata,
                t: locale,
                changeLocale,
            }}
        >
            {children}
        </LocaleContext>
    );
}

interface Props {
    children: ReactNode;
    initLocale: Locale;
    initMetadata?: LocaleMetaData;
}

export function useTranslation() {
    return use(LocaleContext);
}
