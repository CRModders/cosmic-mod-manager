import { AbsolutePositionedSpinner } from "@/components/ui/spinner";
import { useSession } from "@/src/contexts/auth";
import { NotFoundPage } from "@/src/pages/not-found";
import type { Organisation, ProjectListItem, TeamMember } from "@shared/types/api";
import { useQuery } from "@tanstack/react-query";
import { createContext, useEffect, useState } from "react";
import { Outlet, useParams } from "react-router";
import { getOrgDataQuery, getOrgProjectsQuery } from "./_loader";

interface OrgDataContext {
    orgData: Organisation | null;
    projects: ProjectListItem[] | null;
    currUsersMembership: TeamMember | null;
    fetchOrgData: (slug?: string) => Promise<void>;
}

export const orgDataContext = createContext<OrgDataContext>({
    orgData: null,
    projects: null,
    currUsersMembership: null,
    fetchOrgData: async (slug?: string) => {
        slug;
    },
});

export const OrgDataContextProvider = ({ children }: { children: React.ReactNode }) => {
    const { session } = useSession();
    const { slug } = useParams();
    const [currSlug, setCurrSlug] = useState(slug);

    const orgData = useQuery(getOrgDataQuery(slug));
    const orgProjects = useQuery(getOrgProjectsQuery(slug));
    const isFetchingData = orgData.isLoading && orgProjects.isLoading;

    const currUsersMembership = orgData.data?.members.find((member) => member.userId === session?.id) || null;

    const fetchOrgData = async (slug?: string) => {
        if (slug && slug !== currSlug) {
            setCurrSlug(slug);
        } else {
            await orgData.refetch();
            // await Promise.all([orgData.refetch(), orgProjects.refetch()]);
        }
    };

    useEffect(() => {
        if (slug !== currSlug && slug !== orgData.data?.slug && slug !== orgData.data?.id) {
            fetchOrgData(slug);
        }
    }, [slug]);

    return (
        <orgDataContext.Provider
            value={{
                orgData: orgData.data || null,
                projects: orgProjects.data || null,
                currUsersMembership: currUsersMembership,
                fetchOrgData: fetchOrgData,
            }}
        >
            {children ? children : <Outlet />}
            {isFetchingData ? <AbsolutePositionedSpinner /> : null}
            {!isFetchingData && !orgData.data ? (
                <NotFoundPage title="User not found" description={`No organization exists with slug / ID  "${slug}"`} />
            ) : null}
        </orgDataContext.Provider>
    );
};
