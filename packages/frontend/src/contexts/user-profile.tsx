import { AbsolutePositionedSpinner } from "@/components/ui/spinner";
import type { ProjectListItem } from "@shared/types/api";
import type { UserProfileData } from "@shared/types/api/user";
import { useQuery } from "@tanstack/react-query";
import { createContext } from "react";
import { Outlet, useParams } from "react-router-dom";
import { NotFoundPage } from "../pages/not-found";
import { getProjectsListDataQuery, getUserProfileDataQuery } from "./_loaders";

interface UserProfileContext {
    userData: UserProfileData | null;
    projectsList: ProjectListItem[] | null;
}

export const userProfileContext = createContext<UserProfileContext>({
    userData: null,
    projectsList: null,
});

export const UserProfileContextProvider = ({ children }: { children: React.ReactNode }) => {
    const { userName } = useParams();

    const userData = useQuery(getUserProfileDataQuery(userName));
    const projectsList = useQuery(getProjectsListDataQuery(userName));
    const isFetchingData = userData.isLoading && projectsList.isLoading;

    return (
        <userProfileContext.Provider
            value={{
                userData: userData.data || null,
                projectsList: projectsList.data || null,
            }}
        >
            {children ? children : <Outlet />}
            {isFetchingData ? <AbsolutePositionedSpinner /> : null}
            {!isFetchingData && !userData.data ? (
                <NotFoundPage title="User not found" description={`No user exists with username or ID of "${userName}"`} />
            ) : null}
        </userProfileContext.Provider>
    );
};
