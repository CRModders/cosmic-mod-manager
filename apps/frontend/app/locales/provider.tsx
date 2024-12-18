import { disableInteractions, enableInteractions } from "@app/utils/dom";
import { type ReactNode, createContext, use, useState } from "react";
import type { NavigateFunction } from "react-router";
import { prepend, removeLeading, removeTrailing, usePathname, useUrlLocale } from "~/utils/urls";
import { formatLocaleCode, getLocale, parseLocale } from ".";
import en from "./en/translation";
import { DefaultLocale, GetLocaleMetadata } from "./meta";
import type { Locale, LocaleMetaData } from "./types";

interface LocaleContext {
    locale: LocaleMetaData;
    t: Locale;
    changeLocale: (locale: string, navigate?: NavigateFunction) => void;
}
const LocaleContext = createContext<LocaleContext>({
    locale: DefaultLocale,
    t: en,
    changeLocale: (locale: string, navigate?: NavigateFunction) => {},
});

export function LocaleProvider({ children, initLocale, initMetadata }: Props) {
    const [locale, setLocale] = useState(initLocale);
    const [localeMetadata, setLocaleMetadata] = useState(initMetadata || DefaultLocale);

    async function changeLocale(locale: string, navigate?: NavigateFunction) {
        disableInteractions();

        if (navigate) {
            const newLangMetadata = GetLocaleMetadata(locale);
            const newUrl = formatUrlWithLocalePrefix(newLangMetadata || DefaultLocale);
            navigate(newUrl, { preventScrollReset: true });
        }

        setLocale(await getLocale(locale));
        setLocaleMetadata(GetLocaleMetadata(parseLocale(locale)) || DefaultLocale);

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

export function formatUrlWithLocalePrefix(locale: LocaleMetaData, omitDefaultLocale = true) {
    // Get the current pathname
    const pathname = usePathname();
    // Get the current locale prefix and prepend a slash in front of it
    const currLocalePrefix = prepend("/", useUrlLocale());

    // Change the prefix based on the new locale
    let localeCode = formatLocaleCode(locale);
    if (omitDefaultLocale === true && localeCode === formatLocaleCode(DefaultLocale)) {
        localeCode = "";
    }

    // Remove the current locale prefix from the pathname
    const pathnameWithoutLocale = prepend("/", removeLeading(currLocalePrefix, pathname));

    // Prepend the new locale prefix to the pathname, and remove any trailing slashes
    return removeTrailing("/", prepend(localeCode, pathnameWithoutLocale));
}

interface Props {
    children: ReactNode;
    initLocale: Locale;
    initMetadata?: LocaleMetaData;
}

export function useTranslation() {
    return use(LocaleContext);
}
