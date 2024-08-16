import { addToUsedRateLimit } from "@/middleware/rate-limiter";
import prisma from "@/services/prisma";
import { getFileFromStorage } from "@/services/storage";
import { isProjectAccessibleToCurrSession } from "@/utils";
import httpCode from "@/utils/http";
import { CHARGE_FOR_SENDING_INVALID_DATA } from "@shared/config/rate-limit-charges";
import type { Context } from "hono";
import type { ContextUserSession } from "../../../types";

export const serveVersionFile = async (ctx: Context, projectSlug: string, versionSlug: string, fileName: string, userSession: ContextUserSession | undefined) => {
    const projectData = await prisma.project.findUnique({
        where: {
            slug: projectSlug
        },
        select: {
            visibility: true,
            status: true,
            versions: {
                where: {
                    slug: versionSlug,
                },
                select: {
                    files: true
                }
            },
            team: {
                select: {
                    members: {
                        select: {
                            userId: true
                        }
                    }
                }
            },
            organisation: {
                select: {
                    team: {
                        select: {
                            members: true
                        }
                    }
                }
            }
        }
    });

    if (!projectData?.versions?.[0]?.files?.[0]?.fileId) {
        await addToUsedRateLimit(ctx, CHARGE_FOR_SENDING_INVALID_DATA);
        return ctx.status(httpCode("not_found"));
    }

    if (!isProjectAccessibleToCurrSession(projectData.visibility, projectData.status, userSession?.id, [...projectData.team.members, ...(projectData.organisation?.team?.members || [])])) {
        return ctx.status(httpCode("not_found"));
    }

    const versionFiles = await prisma.file.findMany({
        where: {
            OR: projectData.versions[0].files.map((file) => ({ id: file.fileId, name: fileName }))
        }
    });

    if (!versionFiles?.[0]?.id) {
        return ctx.status(httpCode("not_found"));
    }

    const fileData = versionFiles[0];
    const file = await getFileFromStorage(fileData.storageService, fileData.url);

    if (!file) return ctx.text("File not found", httpCode("not_found"));

    return new Response(file, { status: httpCode("ok") });
}