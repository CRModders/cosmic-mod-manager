import { AbsolutePositionedSpinner } from "@/components/ui/spinner";
import useFetch from "@/src/hooks/fetch";
import { type DependencyData, LoadingStatus } from "@/types";
import type { ProjectDetailsData, ProjectListItem, ProjectVersionData, TeamMember } from "@shared/types/api";
import { useQuery } from "@tanstack/react-query";
import { createContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import NotFoundPage from "../pages/not-found";
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

const getProjectData = async (slug: string) => {
    try {
        const response = await useFetch(`/api/project/${slug}`);
        if (!response.ok) return null;
        return (await response.json())?.project as ProjectDetailsData | null;
    } catch (err) {
        console.error(err);
        return null;
    }
};

const getAllProjectVersions = async (slug: string) => {
    try {
        const response = await useFetch(`/api/project/${slug}/version`);
        return (await response.json())?.data as ProjectVersionData[] | null;
    } catch (err) {
        console.error(err);
        return null;
    }
};

const getProjectDependencies = async (slug: string) => {
    try {
        const response = await useFetch(`/api/project/${slug}/dependencies`);
        return (await response.json()) as {
            projects: ProjectListItem[];
            versions: ProjectVersionData[];
        } | null;
    } catch (err) {
        console.error(err);
        return null;
    }
};

export const ProjectContextProvider = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const { slug } = useParams();
    const [currUsersMembership, setCurrUsersMembership] = useState<CurrUsersMembership>({ data: null, status: LoadingStatus.LOADING });
    const [currProjectSlug, setCurrProjectSlug] = useState(slug || "");
    const { session } = useSession();

    const {
        data: projectData,
        isLoading: isProjectDataLoading,
        refetch: refetchProjectData,
    } = useQuery<ProjectDetailsData | null>({
        queryKey: [`${currProjectSlug}-project-data`],
        queryFn: () => getProjectData(currProjectSlug),
    });

    const [featuredProjectVersions, setFeaturedProjectVersions] = useState<ProjectVersionData[]>([]);

    const {
        data: allProjectVersions,
        isLoading: isAllProjectVersionsLoading,
        refetch: refetchAllProjectVersions,
    } = useQuery<ProjectVersionData[] | null>({
        queryKey: [`${currProjectSlug}-project-all-versions`],
        queryFn: () => getAllProjectVersions(currProjectSlug),
    });

    const {
        data: projectDependencies,
        isLoading: isProjectDependenciesLoading,
        refetch: refetchProjectDependencies,
    } = useQuery<{ projects: ProjectListItem[]; versions: ProjectVersionData[] } | null>({
        queryKey: [`${currProjectSlug}-project-dependencies`],
        queryFn: () => getProjectDependencies(currProjectSlug),
    });

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

    useEffect(() => {
        if (!projectData?.id) setCurrUsersMembership({ data: null, status: LoadingStatus.LOADING });
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
                setCurrUsersMembership({ data: membership, status: LoadingStatus.LOADED });
            } else {
                setCurrUsersMembership({ data: null, status: LoadingStatus.LOADED });
            }
        }
    }, [session, projectData]);

    useEffect(() => {
        if (allProjectVersions) {
            const featuredVersions = allProjectVersions.filter((version) => version.featured === true);
            setFeaturedProjectVersions(featuredVersions);
        } else {
            setFeaturedProjectVersions([]);
        }
    }, [allProjectVersions]);

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
            {slug === projectData?.slug || slug === projectData?.id ? children : null}
            {(slug !== projectData?.slug && slug !== projectData?.id) || loadingProjectData ? <AbsolutePositionedSpinner /> : null}
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
