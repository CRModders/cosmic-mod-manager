import type { ContextUserSession } from "@/../types";
import { addToUsedRateLimit } from "@/middleware/rate-limiter";
import prisma from "@/services/prisma";
import { getUserSessionFromCtx, inferProjectType } from "@/utils";
import httpCode, { defaultInvalidReqResponse } from "@/utils/http";
import { projectIconUrl } from "@/utils/urls";
import { CHARGE_FOR_SENDING_INVALID_DATA } from "@shared/config/rate-limit-charges";
import { formatUserName } from "@shared/lib/utils";
import type { profileUpdateFormSchema } from "@shared/schemas/settings";
import type { LinkedProvidersListData, ProjectPublishingStatus, ProjectSupport, ProjectVisibility, UserSessionStates } from "@shared/types";
import type { ProfilePageProjectsListData, SessionListData } from "@shared/types/api";
import type { UserProfileData } from "@shared/types/api/user";
import type { Context } from "hono";
import type { z } from "zod";

export const getUserProfileData = async (ctx: Context, userSession: ContextUserSession | undefined, slug: string) => {
    const user = await prisma.user.findFirst({
        where: {
            OR: [{ id: slug }, { lowerCaseUserName: slug.toLowerCase() }],
        },
    });

    if (!user) return ctx.json({ success: false, message: "user not found" }, httpCode("not_found"));

    const dataObj: UserProfileData = {
        id: user.id,
        name: user.name,
        userName: user.userName,
        avatarUrl: user.avatarUrl,
        bio: user.bio,
        dateJoined: user.dateJoined,
    };

    return ctx.json({ success: true, user: dataObj }, httpCode("ok"));
};

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

export const getAllVisibleProjects = async (ctx: Context, userSession: ContextUserSession | undefined, slug: string) => {
    const user = await prisma.user.findFirst({
        where: {
            OR: [{ id: slug }, { lowerCaseUserName: slug.toLowerCase() }],
        },
    });

    if (!user) return ctx.json({ success: false, message: "user not found" }, httpCode("not_found"));

    const list = await prisma.teamMember.findMany({
        where: {
            userId: user.id,
            accepted: true,
        },
        include: {
            team: {
                include: {
                    project: {
                        select: {
                            id: true,
                            slug: true,
                            name: true,
                            summary: true,
                            iconFileId: true,
                            downloads: true,
                            followers: true,
                            dateUpdated: true,
                            datePublished: true,
                            status: true,
                            visibility: true,
                            clientSide: true,
                            serverSide: true,
                            featuredCategories: true,
                            categories: true,
                            gameVersions: true,
                            loaders: true,
                            team: {
                                select: {
                                    members: {
                                        where: {
                                            userId: userSession?.id,
                                        },
                                        select: {
                                            id: true,
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
    });

    if (!list) return ctx.json({ success: true, projects: [] }, httpCode("ok"));

    const projectListData: ProfilePageProjectsListData[] = [];
    for (const item of list) {
        const project = item.team.project;
        if (!project) continue;
        if (!project.team.members?.[0]?.id) continue;

        projectListData.push({
            id: project.id,
            slug: project.slug,
            name: project.name,
            summary: project.summary,
            type: inferProjectType(project.loaders),
            icon: projectIconUrl(project.slug, project.iconFileId || ""),
            downloads: project.downloads,
            followers: project.followers,
            dateUpdated: project.dateUpdated,
            datePublished: project.datePublished,
            status: project.status as ProjectPublishingStatus,
            visibility: project.visibility as ProjectVisibility,
            clientSide: project.clientSide as ProjectSupport,
            serverSide: project.serverSide as ProjectSupport,
            featuredCategories: project.featuredCategories,
            categories: project.categories,
            gameVersions: project.gameVersions,
            loaders: project.loaders,
        });
    }

    return ctx.json({ success: true, projects: projectListData }, httpCode("ok"));
};
