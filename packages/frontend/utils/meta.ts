import type { MetaDescriptor } from "@remix-run/node";
import { SITE_NAME_SHORT } from "@shared/config";
import { DateToISOStr } from "@shared/lib/utils/date-time";
import { getProjectPagePathname } from ".";
import Config from "./config";

type MetaTags =
    | {
          title: string;
          siteMetaDescription?: string;
          description: string;
          image: string;
          url: string;
          linksOnly?: false;
          parentMetaTags?: MetaDescriptor[];
          suffixTitle?: boolean;
          ldJson?: LdJsonObject;
      }
    | {
          title?: string;
          siteMetaDescription?: string;
          description?: string;
          image?: string;
          url: string;
          linksOnly: true;
          parentMetaTags?: MetaDescriptor[];
          suffixTitle?: boolean;
          ldJson?: LdJsonObject;
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

    const mergedMeta = mergeMetaTagsList(links, [
        { title: props.title, "data-tag-name": "title" },
        { name: "description", content: props.siteMetaDescription || props.description },

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

    if (props.ldJson !== undefined) {
        mergedMeta.push({ "script:ld+json": props.ldJson });
    }

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

type LdJsonObject = {
    [Key in string]: LdJsonValue;
} & {
    [Key in string]?: LdJsonValue | undefined;
};
type LdJsonArray = LdJsonValue[] | readonly LdJsonValue[];
type LdJsonPrimitive = string | number | boolean | null;
type LdJsonValue = LdJsonPrimitive | LdJsonObject | LdJsonArray;

interface UserLdJsonData {
    id: string;
    name: string | null;
    userName: string;
    bio: string | null;
    avatarUrl: string | null;
}

export function UserLdJson(user: UserLdJsonData, otherData?: LdJsonObject): LdJsonObject {
    return {
        "@type": "Person",
        "@id": LdJsonId(user.id, LdJsonIdType.Person),
        name: user.userName,
        alternateName: user.name,
        url: `${Config.FRONTEND_URL}/user/${user.userName}`,
        description: user.bio,
        image: user.avatarUrl,
        identifier: `user-${user.id}`,
        ...otherData,
    };
}

interface ProjectLdJsonData {
    id: string;
    name: string;
    slug: string;
    icon: string | null;
    summary: string;
    type: string[];
    datePublished: Date | string;
    dateUpdated: Date | string;
}

export function ProjectLdJson(project: ProjectLdJsonData, otherData?: LdJsonObject): LdJsonObject {
    return {
        "@type": "CreativeWork",
        "@id": LdJsonId(project.id, LdJsonIdType.CreativeWork),
        name: project.name,
        url: `${Config.FRONTEND_URL}${getProjectPagePathname(project.type?.[0], project.slug)}`,
        description: project.summary,
        image: project.icon,
        thumbnailUrl: project.icon,
        dateCreated: DateToISOStr(project.datePublished),
        dateModified: DateToISOStr(project.dateUpdated),
        ...otherData,
    };
}

interface OrganizationLdJsonData {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    icon: string | null;
}

export function OrganizationLdJson(org: OrganizationLdJsonData, otherData?: LdJsonObject): LdJsonObject {
    return {
        "@type": "Organization",
        "@id": LdJsonId(org.id, LdJsonIdType.Organization),
        name: org.name,
        description: org.description,
        url: `${Config.FRONTEND_URL}/organization/${org.slug}`,
        logo: org.icon,
        ...otherData,
    };
}

export enum LdJsonIdType {
    Person = "person",
    CreativeWork = "creativework",
    Organization = "organization",
}

export function LdJsonId(id: string, type: LdJsonIdType): string {
    return `${Config.FRONTEND_URL}/#/schema/${type}/${id}`;
}
