import { useSession } from "@/src/contexts/auth";
import useFetch from "@/src/hooks/fetch";
import type { Notification, ProjectListItem } from "@shared/types/api";
import type { UserProfileData } from "@shared/types/api/user";
import { useQuery } from "@tanstack/react-query";
import { createContext, useEffect } from "react";

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

const getNotifications = async (userName: string) => {
    if (!userName) return null;

    try {
        const response = await useFetch(`/api/user/${userName}/notifications`);
        const result = await response.json();
        return result as Notification[];
    } catch (error) {
        console.error(error);
        return null;
    }
};

const getRelatedProjects = async (notifications: Notification[]) => {
    if (!notifications.length) return null;
    const projectIds: string[] = [];
    for (const notification of notifications) {
        const projectId = notification.body?.projectId;
        if (projectId && typeof projectId === "string") projectIds.push(projectId);
    }

    try {
        const response = await useFetch(`/api/projects?ids=${encodeURIComponent(JSON.stringify(projectIds))}`);
        const result = await response.json();
        if (result?.success === false) return null;

        return result as ProjectListItem[];
    } catch (error) {
        console.error(error);
        return null;
    }
};

const getRelatedUsers = async (notifications: Notification[]) => {
    if (!notifications.length) return null;
    const userIds: string[] = [];
    for (const notification of notifications) {
        const userId = notification.body?.invitedBy;
        if (userId && typeof userId === "string") userIds.push(userId);
    }

    try {
        const response = await useFetch(`/api/users?ids=${encodeURIComponent(JSON.stringify(userIds))}`);
        const result = await response.json();
        if (!result?.success === false) return null;

        return result as UserProfileData[];
    } catch (error) {
        console.error(error);
        return null;
    }
};

const NotificationsProvider = ({ children }: { children: React.ReactNode }) => {
    const { session } = useSession();
    const notifications = useQuery({
        queryKey: [`notifications-${session?.userName}`],
        queryFn: () => getNotifications(session?.userName || ""),
    });
    const relatedProjects = useQuery({
        queryKey: [`notification-relatedProjects-${session?.userName}`],
        queryFn: () => getRelatedProjects(notifications.data || []),
    });
    const relatedUsers = useQuery({
        queryKey: [`notification-relatedUsers-${session?.userName}`],
        queryFn: () => getRelatedUsers(notifications.data || []),
    });

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

    const relatedUsersList = relatedUsers.data ? new Map<string, UserProfileData>() : null;
    if (relatedUsers.data && relatedUsersList) {
        for (const user of relatedUsers.data || []) {
            relatedUsersList.set(user.id, user);
        }
    }

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
                isLoading:
                    notifications.isLoading ||
                    relatedProjects.isLoading ||
                    relatedUsers.isLoading ||
                    !relatedProjectsList ||
                    !relatedUsersList,
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
