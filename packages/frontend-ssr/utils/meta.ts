import type { MetaDescriptor } from "@remix-run/node";
import { SITE_NAME_SHORT } from "@shared/config";

interface MetaTags {
    title: string;
    description: string;
    image: string;
    url: string;
    suffixTitle?: boolean;
}

export function MetaTags(props: MetaTags): MetaDescriptor[] {
    if (props.suffixTitle) {
        props.title = `${props.title} - ${SITE_NAME_SHORT}`;
    }

    return [
        { title: props.title },
        { name: "description", content: props.description },

        { property: "og:site_name", content: SITE_NAME_SHORT },
        { property: "og:type", content: "website" },
        { property: "og:title", content: props.title },
        { property: "og:description", content: props.description },
        { property: "og:image", content: props.image },
        { property: "og:url", content: props.url },

        { name: "twitter:card", content: "summary" },
        { name: "twitter:title", content: props.title },
        { name: "twitter:description", content: props.description },
        { name: "twitter:image", content: props.image },
        { name: "twitter:url", content: props.url },
    ];
}
