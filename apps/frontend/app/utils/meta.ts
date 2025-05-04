import type { MetaDescriptor } from "react-router";
import { formatLocaleCode } from "~/locales";
import SupportedLocales, { DefaultLocale } from "~/locales/meta";
import { formatUrlWithLocalePrefix } from "~/locales/provider";
import Config from "~/utils/config";
import { prepend, removeTrailing } from "~/utils/urls";

type MetaTags =
    | {
          title: string;
          siteMetaDescription?: string;
          description: string;
          image: string;
          url: string;
          parentMetaTags?: MetaDescriptor[];
          suffixTitle?: boolean;
          linksOnly?: false;
          authorProfile?: string;
      }
    | {
          title?: string;
          siteMetaDescription?: string;
          description?: string;
          image?: string;
          url: string;
          parentMetaTags?: MetaDescriptor[];
          linksOnly: true;
          suffixTitle?: boolean;
          authorProfile?: string;
      };

export function MetaTags(props: MetaTags): MetaDescriptor[] {
    if (props.suffixTitle) {
        props.title = `${props.title} - ${Config.SITE_NAME_SHORT}`;
    }
    if (!props.parentMetaTags) props.parentMetaTags = [];

    const alternateLocaleLinks = SupportedLocales.map((locale) => {
        return {
            tagName: "link",
            rel: "alternate",
            hrefLang: formatLocaleCode(locale),
            href: formatFullUrlWithLocale(props.url, locale, false),
        };
    });

    const links = mergeMetaTagsList(props.parentMetaTags, [
        {
            tagName: "link",
            rel: "canonical",
            href: formatFullUrlWithLocale(props.url, undefined, true),
        },
        {
            tagName: "link",
            rel: "alternate",
            hrefLang: "x-default",
            href: formatFullUrlWithLocale(props.url, DefaultLocale, true),
        },
        ...alternateLocaleLinks,
        { property: "og:url", content: formatFullUrlWithLocale(props.url) },
        { name: "twitter:url", content: formatFullUrlWithLocale(props.url) },
        ...(props.authorProfile ? [AuthorLink(props.authorProfile)] : []),
    ]);

    if (props.linksOnly) {
        return links;
    }

    const mergedMeta = mergeMetaTagsList(links, [
        { title: props.title, "data-tag-name": "title" },
        { name: "description", content: props.siteMetaDescription || props.description },

        { property: "og:site_name", content: Config.SITE_NAME_SHORT },
        { property: "og:type", content: "website" },
        { property: "og:title", content: props.title },
        { property: "og:description", content: props.description },
        { property: "og:image", content: props.image },

        { name: "twitter:card", content: "summary" },
        { name: "twitter:title", content: props.title },
        { name: "twitter:description", content: props.description },
        { name: "twitter:image", content: props.image },
    ]);

    return mergedMeta;
}

function mergeMetaTagsList(originalList: MetaDescriptor[], newItems: MetaDescriptor[]) {
    const combinedList = newItems.slice();

    const matchKeys = ["name", "property", "rel", "hrefLang", "tagName", "data-tag-name"];

    outerLoop: for (const originalItem of originalList) {
        for (const existingItem of combinedList) {
            let isItemDuplicate = true;
            for (const key of matchKeys) {
                // @ts-ignore
                if (originalItem[key] !== existingItem[key]) {
                    isItemDuplicate = false;
                }
            }

            if (isItemDuplicate) {
                continue outerLoop;
            }
        }

        combinedList.push(originalItem);
    }

    return combinedList;
}

function AuthorLink(url: string) {
    return {
        tagName: "link",
        rel: "author",
        href: url,
    };
}

// Get language specific URL for a given link
export function formatFullUrlWithLocale(link: string | URL, targetLocale = DefaultLocale, omitDefaultLocale = true) {
    const url = new URL(link);

    const formattedPath = formatUrlWithLocalePrefix(targetLocale, omitDefaultLocale, url.pathname);
    const newUrl = `${url.origin}${prepend("/", formattedPath)}${url.search}${url.hash}`;
    return removeTrailing("/", newUrl);
}
