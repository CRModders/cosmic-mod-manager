import { SITE_NAME_LONG } from "@app/utils/config";
import { projectTypes } from "@app/utils/config/project";
import { CapitalizeAndFormatString } from "@app/utils/string";
import type { ProjectListItem } from "@app/utils/types/api";
import { useLoaderData } from "react-router";
import HomePage from "~/pages/page";
import Config from "~/utils/config";
import { MetaTags } from "~/utils/meta";
import { resJson, serverFetch } from "~/utils/server-fetch";
import type { Route } from "./+types/page";

export default function HomePage_Wrapper() {
    const projects = useLoaderData() as ProjectListItem[];

    return <HomePage projects={projects} />;
}

export async function loader(props: Route.LoaderArgs): Promise<ProjectListItem[]> {
    const res = await serverFetch(props.request, "/api/projects/home-page-carousel");
    const projects = (await resJson(res)) as ProjectListItem[];

    return projects || [];
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