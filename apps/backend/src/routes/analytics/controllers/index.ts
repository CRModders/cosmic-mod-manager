import { getTimeRange } from "@app/utils/date";
import { combineProjectMembers, doesMemberHaveAccess } from "@app/utils/project";
import { ProjectPermission, type TimelineOptions } from "@app/utils/types";
import { GetManyProjects_ListItem } from "~/db/project_item";
import clickhouse, { ANALYTICS_DB } from "~/services/clickhouse";
import type { Analytics_ProjectDownloads } from "~/services/clickhouse/types";
import type { ContextUserData } from "~/types";
import { HTTP_STATUS, invalidReqestResponseData, unauthorizedReqResponseData } from "~/utils/http";

interface getAnalyticsDataProps {
    // Either startDate and endDate or timeline must be provided
    startDate?: Date | null;
    endDate?: Date | null;

    timeline?: TimelineOptions | undefined;

    resolutionDays: number;
    projectIds: string[];
}

export async function getDownloadsAnalyticsData(user: ContextUserData, props: getAnalyticsDataProps) {
    let startDate: Date;
    let endDate: Date;

    if (props.startDate && props.endDate) {
        startDate = new Date(props.startDate);
        endDate = new Date(props.endDate);
    } else if (props.timeline) {
        [startDate, endDate] = getTimeRange(props.timeline);
    } else {
        return invalidReqestResponseData("Either startDate and endDate (YYYY-MM-DD) or timeline query param must be provided");
    }

    const projectData = await GetManyProjects_ListItem(props.projectIds);
    if (!projectData?.length) {
        return invalidReqestResponseData("No projects found");
    }

    const permitted_ProjectIds: string[] = [];

    // Check user permissions
    for (const project of projectData) {
        const member = combineProjectMembers(project.team.members, project.organisation?.team.members || []).get(user.id);
        if (!member?.id) continue;

        const canSeeAnalytics = doesMemberHaveAccess(
            ProjectPermission.VIEW_ANALYTICS,
            member.permissions as ProjectPermission[],
            member.isOwner,
            user.role,
        );
        if (!canSeeAnalytics) continue;
        permitted_ProjectIds.push(project.id);
    }

    if (!permitted_ProjectIds?.length) {
        return unauthorizedReqResponseData("You do not have permission to view analytics for the project(s)");
    }
    const projectIds_String = permitted_ProjectIds.map((id) => `'${id}'`).join(", ");
    const startDate_String = startDate.toISOString().split("T")[0];
    const endDate_String = endDate.toISOString().split("T")[0];

    // Map := projectId: { date: downloadsCount }
    const downloadsData_Map = new Map<
        string,
        {
            [key: string]: number;
        }
    >();

    const res = await (
        await clickhouse.query({
            query: `
        SELECT project_id, downloads_count, date FROM ${ANALYTICS_DB}.project_downloads
        WHERE project_id IN (${projectIds_String}) AND date >= '${startDate_String}' AND date <= '${endDate_String}'
        ORDER BY date ASC
        `,
            format: "JSON",
        })
    ).json();

    for (let i = 0; i < res.data.length; i++) {
        const record = res.data[i] as Analytics_ProjectDownloads;
        if (!record.project_id || !record.downloads_count || !record.date) continue;

        const projectDownloads = downloadsData_Map.get(record.project_id);
        if (!projectDownloads) {
            downloadsData_Map.set(record.project_id, {
                [record.date]: Number.parseInt(record.downloads_count),
            });
        } else {
            projectDownloads[record.date] = Number.parseInt(record.downloads_count);
            downloadsData_Map.set(record.project_id, projectDownloads);
        }
    }

    return {
        data: Object.fromEntries(downloadsData_Map),
        status: HTTP_STATUS.OK,
    };
}
