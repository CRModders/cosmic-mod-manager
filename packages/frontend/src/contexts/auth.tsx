import useFetch from "@/src/hooks/fetch";
import type { LoggedInUserData } from "@shared/types";
import type { Notification } from "@shared/types/api";
import { useQuery } from "@tanstack/react-query";
import { createContext, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { getNotificationsQuery } from "../pages/dashboard/notifications/_loader";
import { reactQueryClient } from "../providers";
import { getSessionDataQuery } from "./_loaders";

type SessionContext = {
    session: LoggedInUserData | null | undefined;
    logout: () => Promise<void>;
    validateSession: () => Promise<void>;
    invalidateSessionQuery: () => Promise<void>;
    isFetchingInitialData: boolean;
    isFetchingData: boolean;
    isRefetchingData: boolean;

    notifications: Notification[] | null;
};

// undefined state is initial, null is for when the context has been initialized but session is empty
export const SessionContext = createContext<SessionContext>({
    session: undefined,
    logout: async () => {},
    validateSession: async () => {},
    invalidateSessionQuery: async () => {},
    isFetchingInitialData: true,
    isFetchingData: true,
    isRefetchingData: false,

    notifications: null,
});

const SessionProvider = ({ children }: { children: React.ReactNode }) => {
    const sessionData = useQuery(getSessionDataQuery());
    const notifications = useQuery(getNotificationsQuery());
    const navigate = useNavigate();

    const logout = async () => {
        await useFetch("/api/auth/sessions", {
            method: "DELETE",
        });

        invalidateSessionQuery();
        navigate(window.location.href.replace(window.location.origin, ""));
    };

    async function validateSession() {
        await sessionData.refetch();
    }

    async function invalidateSessionQuery() {
        await reactQueryClient.invalidateQueries(getSessionDataQuery());
    }

    return (
        <SessionContext.Provider
            value={{
                session: sessionData.data,
                logout,
                validateSession,
                invalidateSessionQuery,
                isFetchingInitialData: sessionData.isLoading,
                isFetchingData: sessionData.isFetching,
                isRefetchingData: sessionData.isRefetching,

                notifications: notifications.data || null,
            }}
        >
            {children}
        </SessionContext.Provider>
    );
};

export default SessionProvider;

export const useSession = () => {
    return useContext(SessionContext);
};
