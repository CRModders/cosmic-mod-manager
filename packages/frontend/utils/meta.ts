import type { MetaDescriptor } from "@remix-run/node";
import { SITE_NAME_SHORT } from "@shared/config";

type MetaTags =
    | {
          title: string;
          description: string;
          image: string;
          url: string;
          linksOnly?: false;
          parentMetaTags?: MetaDescriptor[];
          suffixTitle?: boolean;
      }
    | {
          title?: string;
          description?: string;
          image?: string;
          url: string;
          linksOnly: true;
          parentMetaTags?: MetaDescriptor[];
          suffixTitle?: boolean;
      };

export function MetaTags(props: MetaTags): MetaDescriptor[] {
    if (props.suffixTitle) {
        props.title = `${props.title} - ${SITE_NAME_SHORT}`;
    }
    if (!props.parentMetaTags) props.parentMetaTags = [];

    const links = mergeMetaTagsList(props.parentMetaTags, [
        {
            tagName: "link",
            rel: "canonical",
            href: props.url,
        },
        {
            tagName: "link",
            rel: "alternate",
            hrefLang: "x-default",
            href: props.url,
        },
        {
            tagName: "link",
            rel: "alternate",
            hrefLang: "en",
            href: props.url,
        },
        { property: "og:url", content: props.url },
        { name: "twitter:url", content: props.url },
    ]);

    if (props.linksOnly) {
        return links;
    }

    return mergeMetaTagsList(links, [
        { title: props.title },
        { name: "description", content: props.description },

        { property: "og:site_name", content: SITE_NAME_SHORT },
        { property: "og:type", content: "website" },
        { property: "og:title", content: props.title },
        { property: "og:description", content: props.description },
        { property: "og:image", content: props.image },

        { name: "twitter:card", content: "summary" },
        { name: "twitter:title", content: props.title },
        { name: "twitter:description", content: props.description },
        { name: "twitter:image", content: props.image },
    ]);
}

function mergeMetaTagsList(originalList: MetaDescriptor[], newItems: MetaDescriptor[]) {
    const combinedList = newItems.slice();

    const matchKeys = ["name", "property", "rel", "hrefLang", "tagName", "title"];

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
