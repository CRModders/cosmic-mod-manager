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

let projectsList: string[] = [];
let orgsList: string[] = [];
let usersList: string[] = [];

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
            if (projectId && !projectsList.includes(projectId)) refetchProjects = true;

            const orgId = notification.body?.orgId as string;
            if (orgId && !orgsList.includes(orgId)) refetchOrgs = true;

            const userId = notification.body?.invitedBy as string;
            if (userId && !usersList.includes(userId)) refetchUsers = true;

            if (refetchProjects && refetchOrgs && refetchUsers) break;
        }

        if (refetchProjects) promises.push(relatedProjects.refetch());
        if (refetchOrgs) promises.push(relatedOrgs.refetch());
        if (refetchUsers) promises.push(relatedUsers.refetch());

        await Promise.all(promises);
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
        (projectsList.length > 0 && !relatedProjects.data) ||
        (orgsList.length > 0 && !relatedOrgs.data) ||
        (usersList.length > 0 && !relatedUsers.data);

    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    useEffect(() => {
        if (notifications.data) {
            refetchRelatedData();
        }
    }, [notifications.data]);

    useEffect(() => {
        if (relatedProjects.data) projectsList = relatedProjects.data.map((project) => project.id);
        else projectsList = [];

        if (relatedOrgs.data) orgsList = relatedOrgs.data.map((org) => org.id);
        else orgsList = [];

        if (relatedUsers.data) usersList = relatedUsers.data.map((user) => user.id);
        else usersList = [];
    }, [relatedProjects.data, relatedOrgs.data, relatedUsers.data]);

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
