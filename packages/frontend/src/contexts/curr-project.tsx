import { type DependencyData, LoadingStatus } from "@/types";
import { getCurrMember } from "@shared/lib/utils";
import type { ProjectDetailsData, ProjectVersionData, TeamMember } from "@shared/types/api";
import { useQuery } from "@tanstack/react-query";
import { createContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { NotFoundPage } from "../pages/not-found";
import { reactQueryClient } from "../providers";
import { getAllProjectVersionsQuery, getProjectDataQuery, getProjectDependenciesQuery } from "./_loaders";
import { useSession } from "./auth";

type CurrUsersMembership = {
    data: TeamMember | null;
    status: LoadingStatus;
};

type ProjectContext = {
    fetchProjectData: (slug?: string) => Promise<void>;
    alterProjectSlug: (slug: string) => void;
    projectData: ProjectDetailsData | null | undefined;
    fetchingProjectData: boolean;
    featuredProjectVersions: ProjectVersionData[] | undefined | null;
    allProjectVersions: ProjectVersionData[] | undefined | null;
    currUsersMembership: CurrUsersMembership;
    projectDependencies: DependencyData;
    invalidateAllQueries: () => Promise<void>;
};

export const projectContext = createContext<ProjectContext>({
    projectData: undefined,
    fetchProjectData: async (slug?: string) => {
        slug;
    },
    fetchingProjectData: true,
    alterProjectSlug: (slug: string) => {
        slug;
    },
    featuredProjectVersions: undefined,
    allProjectVersions: undefined,
    currUsersMembership: {
        data: null,
        status: LoadingStatus.LOADING,
    },
    projectDependencies: {
        projects: [],
        versions: [],
    },
    invalidateAllQueries: async () => {},
});

export const invalidateAllProjectQueries = async (slug: string) => {
    await Promise.all([
        reactQueryClient.invalidateQueries(getProjectDataQuery(slug)),
        reactQueryClient.invalidateQueries(getAllProjectVersionsQuery(slug)),
        reactQueryClient.invalidateQueries(getProjectDependenciesQuery(slug)),
    ]);
};

export const ProjectContextProvider = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const { slug } = useParams();
    const [currProjectSlug, setCurrProjectSlug] = useState(slug || "");
    const { session } = useSession();

    const {
        data: projectData,
        isLoading: isProjectDataLoading,
        refetch: refetchProjectData,
    } = useQuery(getProjectDataQuery(currProjectSlug));

    const { data: allProjectVersions, isLoading: isAllProjectVersionsLoading } = useQuery(getAllProjectVersionsQuery(currProjectSlug));

    const { data: projectDependencies, isLoading: isProjectDependenciesLoading } = useQuery(getProjectDependenciesQuery(currProjectSlug));

    const fetchProjectData = async (slug?: string) => {
        if (slug && currProjectSlug !== slug) {
            setCurrProjectSlug(slug);
        } else {
            await refetchProjectData();
        }
    };

    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    useEffect(() => {
        if (slug !== currProjectSlug && slug !== projectData?.slug && slug !== projectData?.id) {
            fetchProjectData(slug);
        }
    }, [slug]);

    let currUsersMembership: CurrUsersMembership = { data: null, status: LoadingStatus.LOADING };

    if (!projectData?.id || !session?.id) currUsersMembership = { data: null, status: LoadingStatus.LOADING };
    else {
        const membership = getCurrMember(session.id, projectData.members, projectData.organisation?.members || []);

        if (membership?.id) {
            currUsersMembership = { data: membership, status: LoadingStatus.LOADED };
        } else {
            currUsersMembership = { data: null, status: LoadingStatus.LOADED };
        }
    }

    let featuredProjectVersions: ProjectVersionData[] = [];
    if (allProjectVersions) {
        featuredProjectVersions = allProjectVersions.filter((version) => version.featured === true);
    } else {
        featuredProjectVersions = [];
    }

    const loadingProjectData = isProjectDataLoading || isAllProjectVersionsLoading || isProjectDependenciesLoading;

    return (
        <projectContext.Provider
            value={{
                projectData,
                fetchProjectData,
                fetchingProjectData: loadingProjectData,
                alterProjectSlug: setCurrProjectSlug,
                featuredProjectVersions,
                allProjectVersions,
                currUsersMembership: currUsersMembership,
                projectDependencies: projectDependencies || {
                    projects: [],
                    versions: [],
                },
                invalidateAllQueries: async () => await invalidateAllProjectQueries(currProjectSlug),
            }}
        >
            {children}
            {!loadingProjectData && !projectData?.id ? (
                <NotFoundPage
                    title="Project not found"
                    description={`The project with the slug/ID "${slug}" does not exist.`}
                    className=""
                />
            ) : null}
        </projectContext.Provider>
    );
};

export default ProjectContextProvider;
