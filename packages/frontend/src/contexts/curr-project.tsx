import { type DependencyData, LoadingStatus } from "@/types";
import type { ProjectDetailsData, ProjectVersionData, TeamMember } from "@shared/types/api";
import { useQuery } from "@tanstack/react-query";
import { createContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { NotFoundPage } from "../pages/not-found";
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
    fetchAllProjectVersions: () => Promise<void>;
    currUsersMembership: CurrUsersMembership;
    projectDependencies: DependencyData;
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
    fetchAllProjectVersions: async () => {},
    currUsersMembership: {
        data: null,
        status: LoadingStatus.LOADING,
    },
    projectDependencies: {
        projects: [],
        versions: [],
    },
});

export const ProjectContextProvider = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const { slug } = useParams();
    // const [currUsersMembership, setCurrUsersMembership] = useState<CurrUsersMembership>({ data: null, status: LoadingStatus.LOADING });
    const [currProjectSlug, setCurrProjectSlug] = useState(slug || "");
    const { session } = useSession();

    const {
        data: projectData,
        isLoading: isProjectDataLoading,
        refetch: refetchProjectData,
    } = useQuery(getProjectDataQuery(currProjectSlug));

    const {
        data: allProjectVersions,
        isLoading: isAllProjectVersionsLoading,
        refetch: refetchAllProjectVersions,
    } = useQuery(getAllProjectVersionsQuery(currProjectSlug));

    const {
        data: projectDependencies,
        isLoading: isProjectDependenciesLoading,
        refetch: refetchProjectDependencies,
    } = useQuery(getProjectDependenciesQuery(currProjectSlug));

    const fetchProjectData = async (slug?: string) => {
        if (slug && currProjectSlug !== slug) {
            setCurrProjectSlug(slug);
        } else {
            await refetchProjectData();
        }
    };

    const fetchAllProjectVersions = async () => {
        await refetchAllProjectVersions();
        await refetchProjectDependencies();
    };

    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    useEffect(() => {
        if (slug !== currProjectSlug && slug !== projectData?.slug && slug !== projectData?.id) {
            fetchProjectData(slug);
        }
    }, [slug]);

    let currUsersMembership: CurrUsersMembership = { data: null, status: LoadingStatus.LOADING };

    if (!projectData?.id) currUsersMembership = { data: null, status: LoadingStatus.LOADING };
    else {
        // let valueSet = false;
        let membership = null;
        for (const member of projectData.members) {
            if (member.userId === session?.id && member.accepted === true) {
                // valueSet = true;
                membership = member;
                break;
            }
        }

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
                fetchAllProjectVersions,
                currUsersMembership: currUsersMembership,
                projectDependencies: projectDependencies || {
                    projects: [],
                    versions: [],
                },
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
