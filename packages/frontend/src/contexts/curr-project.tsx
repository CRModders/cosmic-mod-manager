import { AbsolutePositionedSpinner } from "@/components/ui/spinner";
import useFetch from "@/src/hooks/fetch";
import type { DependencyData } from "@/types";
import type { ProjectDetailsData, ProjectVersionData, ProjectsListData, TeamMember } from "@shared/types/api";
import { useQuery } from "@tanstack/react-query";
import { createContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSession } from "./auth";

type ProjectContextType = {
    fetchProjectData: (slug?: string) => Promise<void>;
    alterProjectSlug: (slug: string) => void;
    projectData: ProjectDetailsData | null | undefined;
    fetchingProjectData: boolean;
    featuredProjectVersions: ProjectVersionData[] | undefined | null;
    allProjectVersions: ProjectVersionData[] | undefined | null;
    fetchAllProjectVersions: () => Promise<void>;
    currUsersMembership: TeamMember | null;
    projectDependencies: DependencyData;
};

export const projectContext = createContext<ProjectContextType>({
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
    fetchAllProjectVersions: async () => { },
    currUsersMembership: null,
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
            projects: ProjectsListData[];
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
    const [fetchingProjectData, setFetchingProjectData] = useState(true);
    const [currUsersMembership, setCurrUsersMembership] = useState<TeamMember | null>(null);
    const [currProjectSlug, setCurrProjectSlug] = useState(slug || "");
    const { session } = useSession();
    const navigate = useNavigate();

    const {
        data: projectData,
        isFetching: isProjectDataFetching,
        refetch: refetchProjectData
    } = useQuery<ProjectDetailsData | null>({
        queryKey: [`${currProjectSlug}-project-data`],
        queryFn: () => getProjectData(currProjectSlug),
    });

    const [featuredProjectVersions, setFeaturedProjectVersions] = useState<ProjectVersionData[]>([]);

    const {
        data: allProjectVersions,
        isFetching: isAllProjectVersionsFetching,
        refetch: refetchAllProjectVersions
    } = useQuery<ProjectVersionData[] | null>({
        queryKey: [`${currProjectSlug}-project-all-versions`],
        queryFn: () => getAllProjectVersions(currProjectSlug),
    });

    const {
        data: projectDependencies,
        isFetching: isProjectDependenciesFetching,
        refetch: refetchProjectDependencies
    } = useQuery<{ projects: ProjectsListData[]; versions: ProjectVersionData[] } | null>({
        queryKey: [`${currProjectSlug}-project-dependencies`],
        queryFn: () => getProjectDependencies(currProjectSlug),
    });

    const fetchProjectData = async (slug?: string) => {
        if (slug && currProjectSlug !== slug) {
            setCurrProjectSlug(slug);
        } else {
            await Promise.all([refetchProjectData(), fetchAllProjectVersions()]);
        }
    };

    const fetchAllProjectVersions = async () => {
        await refetchAllProjectVersions();
        await refetchProjectDependencies();
    };

    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    useEffect(() => {
        if (slug !== currProjectSlug && slug !== projectData?.id) {
            fetchProjectData(slug);
        }
    }, [slug]);

    useEffect(() => {

        if (!projectData?.id) setCurrUsersMembership(null);
        else {
            let valueSet = false;
            for (const member of projectData.members) {
                if (member.userId === session?.id) {
                    valueSet = true;
                    setCurrUsersMembership(member);
                    break;
                }
            }

            if (!valueSet) {
                for (const member of projectData.organisation?.members || []) {
                    if (member.userId === session?.id) {
                        setCurrUsersMembership(member);
                    }
                }
            }
        }
    }, [session, projectData]);

    useEffect(() => {
        if (allProjectVersions) {
            const featuredVersions = allProjectVersions.filter(
                (version) => version.featured === true
            );
            setFeaturedProjectVersions(featuredVersions);
        } else {
            setFeaturedProjectVersions([]);
        }
    }, [allProjectVersions]);

    useEffect(() => {
        if (
            isProjectDataFetching ||
            isAllProjectVersionsFetching ||
            isProjectDependenciesFetching
        )
            setFetchingProjectData(true);
        else setFetchingProjectData(false);
    }, [
        isProjectDataFetching,
        isAllProjectVersionsFetching,
        isProjectDependenciesFetching,
    ]);

    return (
        <projectContext.Provider
            value={{
                projectData,
                fetchProjectData,
                fetchingProjectData,
                alterProjectSlug: setCurrProjectSlug,
                featuredProjectVersions,
                allProjectVersions,
                fetchAllProjectVersions,
                currUsersMembership,
                projectDependencies: projectDependencies || {
                    projects: [],
                    versions: [],
                },
            }}
        >
            {children}
            {
                slug !== projectData?.slug && slug !== projectData?.id ?
                    <AbsolutePositionedSpinner /> : null
            }
        </projectContext.Provider>
    );
};

export default ProjectContextProvider;
