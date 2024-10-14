import type { Notification, ProjectListItem } from "@shared/types/api";
import type { UserProfileData } from "@shared/types/api/user";
import { useQuery } from "@tanstack/react-query";
import { createContext, useEffect } from "react";
import { getNotificationsQuery, getRelatedProjectsQuery, getRelatedUsersQuery } from "./_loader";

interface NotificationsContext {
    isLoading: boolean;
    notifications: Notification[] | null;
    relatedProjects: Map<string, ProjectListItem> | null;
    relatedUsers: Map<string, UserProfileData> | null;
    refetchNotifications: () => Promise<void>;
}

export const NotificationsContext = createContext<NotificationsContext>({
    isLoading: true,
    notifications: null,
    relatedProjects: null,
    relatedUsers: null,
    refetchNotifications: async () => {},
});

const NotificationsProvider = ({ children }: { children: React.ReactNode }) => {
    const notifications = useQuery(getNotificationsQuery());
    const relatedProjects = useQuery(getRelatedProjectsQuery(notifications.data || []));
    const relatedUsers = useQuery(getRelatedUsersQuery(notifications.data || []));

    const refetchNotifications = async () => {
        await notifications.refetch();
        await Promise.all([relatedProjects.refetch(), relatedUsers.refetch()]);
    };

    const relatedProjectsList = relatedProjects.data ? new Map<string, ProjectListItem>() : undefined;
    if (relatedProjects.data && relatedProjectsList) {
        for (const project of relatedProjects.data || []) {
            relatedProjectsList.set(project.id, project);
        }
    }

    const relatedUsersList = relatedUsers.data ? new Map<string, UserProfileData>() : undefined;
    if (relatedUsers.data && relatedUsersList) {
        for (const user of relatedUsers.data || []) {
            relatedUsersList.set(user.id, user);
        }
    }

    const isNotificationsLoading =
        notifications.isLoading ||
        relatedProjects.isLoading ||
        relatedUsers.isLoading ||
        (!!notifications.data?.length && (!relatedProjectsList || !relatedUsersList));

    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    useEffect(() => {
        if (notifications.data) {
            if (!relatedProjects.data) relatedProjects.refetch();
            if (!relatedUsers.data) relatedUsers.refetch();
        }
    }, [notifications.data]);

    return (
        <NotificationsContext.Provider
            value={{
                notifications: notifications.data || null,
                isLoading: isNotificationsLoading,
                relatedProjects: relatedProjectsList || null,
                relatedUsers: relatedUsersList || null,
                refetchNotifications: refetchNotifications,
            }}
        >
            {children}
        </NotificationsContext.Provider>
    );
};

export default NotificationsProvider;
