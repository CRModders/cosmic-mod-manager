import type { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData, useOutletContext } from "@remix-run/react";
import Config from "@root/utils/config";
import { MetaTags } from "@root/utils/meta";
import { resJson, serverFetch } from "@root/utils/server-fetch";
import { SITE_NAME_LONG } from "@shared/config";
import { projectTypes } from "@shared/config/project";
import { CapitalizeAndFormatString } from "@shared/lib/utils";
import type { ProjectListItem } from "@shared/types/api";
import HomePage from "~/pages/page";
import type { RootOutletData } from "~/root";

export default function HomePage_Wrapper() {
    const { session } = useOutletContext<RootOutletData>();
    const data = useLoaderData<typeof loader>();

    return <HomePage session={session} projects={data.projects} />;
}

export async function loader(props: LoaderFunctionArgs) {
    const res = await serverFetch(props.request, "/api/projects/home-page-carousel");
    const projects = (await resJson(res)) as ProjectListItem[];

    return {
        projects: projects || [],
    };
}

export function shouldRevalidate() {
    return false;
}

const ldJson = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME_LONG,
    url: Config.FRONTEND_URL,
    hasPart: projectTypes.map((type) => ({
        "@type": "WebPage",
        name: CapitalizeAndFormatString(type),
        url: `${Config.FRONTEND_URL}/${type}s/`,
    })),
};

export function meta() {
    return MetaTags({
        title: SITE_NAME_LONG,
        description:
            "Download Cosmic Reach mods, plugins, datamods, shaders, resourcepacks, and modpacks on CRMM (Cosmic Reach Mod Manager). Discover and publish projects on CRMM with a modern, easy to use interface and API.",
        image: `${Config.FRONTEND_URL}/icon.png`,
        url: Config.FRONTEND_URL,
        ldJson: ldJson,
    });
}
