import type { OrganisationListItem } from "@app/utils/types/api";
import { GetManyOrganizations } from "~/db/organization_item";
import type { RouteHandlerResponse } from "~/types/http";
import { HTTP_STATUS } from "~/utils/http";
import { orgIconUrl } from "~/utils/urls";

export async function getManyOrgs(orgIds: string[]): Promise<RouteHandlerResponse> {
    const list = await GetManyOrganizations(orgIds);
    const orgsList: OrganisationListItem[] = [];

    for (const org of list) {
        if (!org) continue;

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
