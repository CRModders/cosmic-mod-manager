import { routeLoader } from "@/lib/route-loader";
import useFetch from "@/src/hooks/fetch";
import type { Notification, ProjectListItem } from "@shared/types/api";
import type { UserProfileData } from "@shared/types/api/user";
import type { UseQueryOptions } from "@tanstack/react-query";

const getNotifications = async () => {
    try {
        const response = await useFetch("/api/notifications");
        const data = await response.json();
        if (!response.ok) return null;

        return data as Notification[];
    } catch (error) {
        console.error(error);
        return null;
    }
};
export const getNotificationsQuery = () => {
    return {
        queryKey: ["notifications"],
        queryFn: getNotifications,
        staleTime: 10 * 1000,
    } satisfies UseQueryOptions;
};

export const notificationsPageLoader = routeLoader(getNotificationsQuery());

// Additional queries for related projects and users
const getRelatedProjects = async (notifications: Notification[]) => {
    if (!notifications.length) return null;
    const projectIds: string[] = [];
    for (const notification of notifications) {
        const projectId = notification.body?.projectId;
        if (projectId && typeof projectId === "string") projectIds.push(projectId);
    }

    try {
        const response = await useFetch(`/api/projects?ids=${encodeURIComponent(JSON.stringify(projectIds))}`);
        const data = await response.json();
        if (data?.success === false) return null;

        return data as ProjectListItem[];
    } catch (error) {
        console.error(error);
        return null;
    }
};
export const getRelatedProjectsQuery = (notifications: Notification[]) => {
    return {
        queryKey: ["notification-related-projects"],
        queryFn: async () => await getRelatedProjects(notifications),
        staleTime: 10 * 1000,
    } satisfies UseQueryOptions;
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
        const data = await response.json();
        if (!data?.success === false) return null;

        return data as UserProfileData[];
    } catch (error) {
        console.error(error);
        return null;
    }
};
export const getRelatedUsersQuery = (notifications: Notification[]) => {
    return {
        queryKey: ["notification-related-users"],
        queryFn: async () => await getRelatedUsers(notifications),
        staleTime: 10 * 1000,
    } satisfies UseQueryOptions;
};
