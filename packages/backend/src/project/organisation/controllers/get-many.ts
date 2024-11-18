import prisma from "@/services/prisma";
import type { RouteHandlerResponse } from "@/types/http";
import { HTTP_STATUS } from "@/utils/http";
import { orgIconUrl } from "@/utils/urls";
import type { OrganisationListItem } from "@shared/types/api";

export async function getManyOrgs(projectIds: string[]): Promise<RouteHandlerResponse> {
    const list = await prisma.organisation.findMany({
        where: {
            id: {
                in: projectIds,
            },
        },
    });

    const orgsList: OrganisationListItem[] = [];

    for (const org of list) {
        orgsList.push({
            id: org.id,
            teamId: org.teamId,
            name: org.name,
            slug: org.slug,
            icon: orgIconUrl(org.id, org.iconFileId),
            description: org.description,
        });
    }

    return { data: orgsList, status: HTTP_STATUS.OK };
}
