import prisma from "@/services/prisma";
import { status } from "@/utils/http";
import type { GlobalUserRole } from "@shared/types";
import type { UserProfileData } from "@shared/types/api/user";
import type { Context } from "hono";

export const getManyUsers = async (ctx: Context, ids: string[]) => {
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

    return ctx.json(usersList, status.OK);
};
