import type { ContextUserSession } from "@/../types";
import { addToUsedRateLimit } from "@/middleware/rate-limiter";
import prisma from "@/services/prisma";
import { getUserSessionFromCtx } from "@/utils";
import httpCode, { defaultInvalidReqResponse } from "@/utils/http";
import { CHARGE_FOR_SENDING_INVALID_DATA } from "@shared/config/rate-limit-charges";
import { formatUserName } from "@shared/lib/utils";
import type { profileUpdateFormSchema } from "@shared/schemas/settings";
import type { LinkedProvidersListData, UserSessionStates } from "@shared/types";
import type { SessionListData } from "@shared/types/api";
import type { Context } from "hono";
import type { z } from "zod";

export const updateUserProfile = async (ctx: Context, profileData: z.infer<typeof profileUpdateFormSchema>) => {
    const userSession = getUserSessionFromCtx(ctx);
    if (!userSession) return ctx.json({}, httpCode("bad_request"));

    profileData.userName = formatUserName(profileData.userName);
    profileData.name = formatUserName(profileData.name, " ");

    const existingUserWithSameUserName =
        profileData.userName.toLowerCase() === userSession.userName.toLowerCase()
            ? null
            : !!(
                await prisma.user.findUnique({
                    where: {
                        lowerCaseUserName: profileData.userName.toLowerCase(),
                        NOT: [{ id: userSession.id }],
                    },
                })
            )?.id;

    if (existingUserWithSameUserName) return ctx.json({ success: false, message: "Username already taken" }, httpCode("bad_request"));

    let avatarUrl = userSession.avatarUrl;
    if (userSession.avatarUrlProvider !== profileData.avatarUrlProvider) {
        const authAccount = await prisma.authAccount.findFirst({
            where: {
                userId: userSession.id,
                providerName: profileData.avatarUrlProvider,
            },
        });

        if (!authAccount?.id) {
            await addToUsedRateLimit(ctx, CHARGE_FOR_SENDING_INVALID_DATA);
            return ctx.json({ success: false, message: "Invalid profile provider" }, httpCode("bad_request"));
        }

        avatarUrl = authAccount?.avatarUrl;
    }

    const updatedUser = await prisma.user.update({
        where: {
            id: userSession.id,
        },
        data: {
            name: profileData.name,
            userName: profileData.userName,
            lowerCaseUserName: profileData.userName.toLowerCase(),
            avatarUrlProvider: profileData.avatarUrlProvider,
            avatarUrl: avatarUrl,
        },
    });

    return ctx.json({ success: true, message: "Profile updated successfully", profileData }, httpCode("ok"));
};

export const getLinkedAuthProviders = async (ctx: Context, userSession: ContextUserSession) => {
    const linkedProviders = await prisma.authAccount.findMany({
        where: {
            userId: userSession.id,
        },
    });

    const providersList: LinkedProvidersListData[] = [];
    for (const provider of linkedProviders) {
        providersList.push({
            id: provider.id,
            providerName: provider.providerName,
            providerAccountId: provider.providerAccountId,
            providerAccountEmail: provider.providerAccountEmail,
            avatarImageUrl: provider.avatarUrl,
        });
    }

    return ctx.json({ providers: providersList }, httpCode("ok"));
};

export const getAllSessions = async (ctx: Context, userSession: ContextUserSession) => {
    const sessions = await prisma.session.findMany({
        where: {
            userId: userSession.id,
        },
        orderBy: { dateCreated: "desc" },
    });

    if (!sessions?.[0]?.id) {
        return defaultInvalidReqResponse(ctx);
    }

    const list: SessionListData[] = [];
    for (const session of sessions) {
        list.push({
            id: session.id,
            userId: session.userId,
            dateCreated: session.dateCreated,
            dateLastActive: session.dateLastActive,
            providerName: session.providerName || "",
            status: session.status as UserSessionStates,
            os: session.os,
            browser: session.browser,
            city: session.city,
            country: session.country,
            ip: session.ip,
            userAgent: session.userAgent,
        });
    }

    return ctx.json({ success: true, sessions: sessions }, httpCode("ok"));
};
