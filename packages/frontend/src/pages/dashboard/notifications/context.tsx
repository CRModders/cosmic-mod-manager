import { useSession } from "@/src/contexts/auth";
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
    const { session } = useSession();

    const notifications = useQuery(getNotificationsQuery(session?.sessionId));
    const relatedOrgs = useQuery(getRelatedOrgsQuery(notifications.data || []));
    const relatedProjects = useQuery(getRelatedProjectsQuery(notifications.data || []));
    const relatedUsers = useQuery(getRelatedUsersQuery(notifications.data || []));

    const refetchNotifications = async () => {
        await notifications.refetch();
    };

    const refetchRelatedData = async () => {
        const promises = [];
        let refetchProjects = false;
        let refetchOrgs = false;
        let refetchUsers = false;

        for (const notification of notifications.data || []) {
            const projectId = notification.body?.projectId as string;
            if (projectId && !relatedProjects.data?.some((p) => p.id === projectId)) refetchProjects = true;

            const orgId = notification.body?.orgId as string;
            if (orgId && !relatedOrgs.data?.some((o) => o.id === orgId)) refetchOrgs = true;

            const userId = notification.body?.invitedBy as string;
            if (userId && !relatedUsers.data?.some((u) => u.id === userId)) refetchUsers = true;

            if (refetchProjects && refetchOrgs && refetchUsers) break;
        }

        if (refetchProjects) promises.push(relatedProjects.refetch());
        if (refetchOrgs) promises.push(relatedOrgs.refetch());
        if (refetchUsers) promises.push(relatedUsers.refetch());

        await Promise.all(promises);
    };

    const relatedProjectsList = relatedProjects?.data ? new Map<string, ProjectListItem>() : null;
    if (relatedProjects?.data && relatedProjectsList) {
        for (const project of relatedProjects?.data || []) {
            relatedProjectsList.set(project.id, project);
        }
    }

    const relatedOrgsList = relatedOrgs?.data ? new Map<string, OrganisationListItem>() : null;
    if (relatedOrgs?.data && relatedOrgsList) {
        for (const org of relatedOrgs?.data || []) {
            relatedOrgsList.set(org.id, org);
        }
    }

    const relatedUsersList = relatedUsers?.data ? new Map<string, UserProfileData>() : null;
    if (relatedUsers?.data && relatedUsersList) {
        for (const user of relatedUsers?.data || []) {
            relatedUsersList.set(user.id, user);
        }
    }

    const requiredProjects: string[] = [];
    const requiredOrgs: string[] = [];
    const requiredUsers: string[] = [];
    for (const notification of notifications.data || []) {
        const projectId = notification.body?.projectId as string;
        if (projectId && !requiredProjects.includes(projectId)) requiredProjects.push(projectId);

        const orgId = notification.body?.orgId as string;
        if (orgId && !requiredOrgs.includes(orgId)) requiredOrgs.push(orgId);

        const userId = notification.body?.invitedBy as string;
        if (userId && !requiredUsers.includes(userId)) requiredUsers.push(userId);
    }

    const isNotificationsLoading =
        notifications.data === null ||
        notifications.isLoading ||
        relatedProjects.isLoading ||
        relatedUsers.isLoading ||
        relatedOrgs.isLoading ||
        (requiredProjects.length > 0 && !relatedProjectsList) ||
        (requiredOrgs.length > 0 && !relatedOrgsList) ||
        (requiredUsers.length > 0 && !relatedUsersList);

    useEffect(() => {
        if (notifications.data) {
            refetchRelatedData();
        }
    }, [notifications.data]);

    useEffect(() => {
        if (session?.sessionId && notifications.data === null) {
            refetchNotifications();
        }
    }, [session?.sessionId]);

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
