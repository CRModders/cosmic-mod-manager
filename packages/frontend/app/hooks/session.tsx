import { useLocation, useNavigate } from "@remix-run/react";
import clientFetch from "@root/utils/client-fetch";
import type { LoggedInUserData } from "@shared/types";
import type { Notification } from "@shared/types/api";
import { createContext, useContext } from "react";
import RefreshPage from "~/components/refresh-page";

type SessionContext = {
    session: LoggedInUserData | null;
    logout: () => Promise<void>;

    notifications: Notification[] | null;
};

export const SessionContext = createContext<SessionContext>({
    session: null,
    logout: async () => {},

    notifications: null,
});

interface SessionProviderProps {
    children: React.ReactNode;
    session: LoggedInUserData | null;
}

const SessionProvider = ({ children, session }: SessionProviderProps) => {
    const navigate = useNavigate();
    const location = useLocation();

    const logout = async () => {
        await clientFetch("/api/auth/sessions", {
            method: "DELETE",
        });

        RefreshPage(navigate, location);
    };

    return (
        <SessionContext.Provider
            value={{
                session: session,
                logout,

                notifications: null,
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
