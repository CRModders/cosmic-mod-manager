import { routeLoader } from "@/lib/route-loader";
import useFetch from "@/src/hooks/fetch";
import type { LinkedProvidersListData } from "@shared/types";
import type { SessionListData } from "@shared/types/api";

// Account settings page loader
const getLinkedAuthProviders = async () => {
    try {
        const res = await useFetch("/api/auth/linked-providers");
        const data = await res.json();
        if (!res.ok || !data) return null;

        return data as LinkedProvidersListData[];
    } catch (err) {
        console.error(err);
        return null;
    }
};
export const getLinkedAuthProvidersQuery = () => {
    return {
        queryKey: ["linked-auth-providers"],
        queryFn: getLinkedAuthProviders,
        staleTime: Number.POSITIVE_INFINITY,
    };
};

export const accountSettingsPageLoader = routeLoader(getLinkedAuthProvidersQuery());

// User sessions page loader
const getLoggedInSessions = async () => {
    try {
        const response = await useFetch("/api/auth/sessions");
        const data = await response.json();
        if (!response.ok || !data) return null;

        return data as SessionListData[];
    } catch (error) {
        console.error(error);
        return null;
    }
};
export const getLoggedInSessionsQuery = () => {
    return {
        queryKey: ["logged-in-sessions"],
        queryFn: getLoggedInSessions,
        staleTime: 30 * 1000,
    };
};

export const userSessionsPageLoader = routeLoader(getLoggedInSessionsQuery());
