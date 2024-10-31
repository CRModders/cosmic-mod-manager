import type { Notification, OrganisationListItem, ProjectListItem } from "@shared/types/api";
import type { UserProfileData } from "@shared/types/api/user";
import { useQuery } from "@tanstack/react-query";
import { createContext, useEffect } from "react";
import { getNotificationsQuery, getRelatedOrgsQuery, getRelatedProjectsQuery, getRelatedUsersQuery } from "./_loader";

interface NotificationsContext {
    isLoading: boolean;
    notifications: Notification[] | null;
    refetchNotifications: () => Promise<void>;

    relatedProjects: Map<string, ProjectListItem> | null;
    relatedOrgs: Map<string, OrganisationListItem> | null;
    relatedUsers: Map<string, UserProfileData> | null;
}

export const NotificationsContext = createContext<NotificationsContext>({
    isLoading: true,
    refetchNotifications: async () => {},

    notifications: null,
    relatedProjects: null,
    relatedOrgs: null,
    relatedUsers: null,
});

const NotificationsProvider = ({ children }: { children: React.ReactNode }) => {
    const notifications = useQuery(getNotificationsQuery());
    const relatedOrgs = useQuery(getRelatedOrgsQuery(notifications.data || []));
    const relatedProjects = useQuery(getRelatedProjectsQuery(notifications.data || []));
    const relatedUsers = useQuery(getRelatedUsersQuery(notifications.data || []));

    const refetchNotifications = async () => {
        await notifications.refetch();
        await Promise.all([relatedProjects.refetch(), relatedUsers.refetch()]);
    };

    const relatedProjectsList = relatedProjects.data ? new Map<string, ProjectListItem>() : null;
    if (relatedProjects.data && relatedProjectsList) {
        for (const project of relatedProjects.data || []) {
            relatedProjectsList.set(project.id, project);
        }
    }

    const relatedOrgsList = relatedOrgs.data ? new Map<string, OrganisationListItem>() : null;
    if (relatedOrgs.data && relatedOrgsList) {
        for (const org of relatedOrgs.data || []) {
            relatedOrgsList.set(org.id, org);
        }
    }

    const relatedUsersList = relatedUsers.data ? new Map<string, UserProfileData>() : null;
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
                isLoading: isNotificationsLoading,
                notifications: notifications.data || null,
                refetchNotifications: refetchNotifications,

                relatedProjects: relatedProjectsList,
                relatedOrgs: relatedOrgsList,
                relatedUsers: relatedUsersList,
            }}
        >
            {children}
        </NotificationsContext.Provider>
    );
};

export default NotificationsProvider;
