import prisma from "@/services/prisma";
import type { RouteHandlerResponse } from "@/types/http";
import { HTTP_STATUS } from "@/utils/http";
import type { GlobalUserRole } from "@shared/types";
import type { UserProfileData } from "@shared/types/api/user";
import type { Context } from "hono";

export async function getManyUsers(ctx: Context, ids: string[]): Promise<RouteHandlerResponse> {
    const users = await prisma.user.findMany({
        where: {
            id: {
                in: ids,
            },
        },
    });

    const usersList: UserProfileData[] = [];
    for (const user of users) {
        usersList.push({
            id: user.id,
            name: user.name,
            userName: user.userName,
            dateJoined: user.dateJoined,
            role: user.role as GlobalUserRole,
            bio: user.bio,
            avatarUrl: user.avatarUrl,
        });
    }

    return { data: usersList, status: HTTP_STATUS.OK };
}
