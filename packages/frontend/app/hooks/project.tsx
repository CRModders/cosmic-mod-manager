import { useLocale, usePathname } from "@root/utils/urls";
import { getCurrMember } from "@shared/lib/utils";
import { getProjectTypeFromName } from "@shared/lib/utils/convertors";
import type { ProjectDetailsData, ProjectListItem, ProjectVersionData, TeamMember } from "@shared/types/api";
import { useRouteLoaderData } from "react-router";
import type { ProjectLoaderData } from "~/routes/project/data-wrapper";
import { useSession } from "./session";

export interface ProjectContextData {
    projectSlug: string;
    projectType: string;

    projectData: ProjectDetailsData;
    allProjectVersions: ProjectVersionData[];
    featuredProjectVersions: ProjectVersionData[] | null;
    currUsersMembership: TeamMember | null;
    dependencies: {
        projects: ProjectListItem[];
        versions: ProjectVersionData[];
    };
}

export function useProjectData(): ProjectContextData {
    const langPrefix = useLocale();
    const session = useSession();

    const projectType = useProjectType();
    // Getting the loader data
    const loaderData = useRouteLoaderData(`${langPrefix}__${projectType}__data-wrapper`) as ProjectLoaderData;

    // We can safely return incomplete data, because the data-wrapper will handle not found cases
    // So no component using this hook will break
    if (!loaderData?.projectData?.id)
        // @ts-ignore
        return {
            projectSlug: loaderData.projectSlug || "",
            projectType: projectType,
        };

    // Formatting the loader data
    const project = loaderData.projectData as ProjectDetailsData;

    const featuredProjectVersions: ProjectVersionData[] = [];
    for (const version of loaderData.versions || []) {
        if (version.featured) {
            featuredProjectVersions.push(version);
        }
    }

    let currUsersMembership: TeamMember | null = null;
    if (!session?.id) currUsersMembership = null;
    else {
        const membership = getCurrMember(session.id, project.members, project.organisation?.members || []);

        if (membership?.id) {
            currUsersMembership = membership;
        } else {
            currUsersMembership = null;
        }
    }

    const deps = loaderData.dependencies || { projects: [], versions: [] };

    return {
        projectSlug: loaderData.projectSlug || "",
        projectType: projectType,

        projectData: project,
        allProjectVersions: loaderData.versions || [],
        featuredProjectVersions: featuredProjectVersions,
        currUsersMembership: currUsersMembership,
        dependencies: deps,
    };
}

export function useProjectType() {
    const pathname = usePathname();
    const langPrefix = useLocale();

    const typeIndex = langPrefix.length ? 2 : 1;
    let typeStr = pathname?.split("/")[typeIndex];
    if (typeStr.endsWith("s")) typeStr = typeStr.slice(0, -1);

    return typeStr === "project" ? "project" : getProjectTypeFromName(typeStr);
}
