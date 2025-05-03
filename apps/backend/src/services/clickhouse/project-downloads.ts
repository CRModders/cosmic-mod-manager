import { ISO_DateStr } from "@app/utils/date";
import clickhouse, { ANALYTICS_DB } from "./index";

export async function getLastMonthProjectDownloads(projectIds: string[]) {
    if (!projectIds?.length) return new Map<string, number>();

    const today = new Date();
    const endDate = ISO_DateStr(today);

    // Set the start date back a month
    // *It handles the month overflow or underflow automatically
    today.setMonth(today.getUTCMonth() - 1);
    const startDate = ISO_DateStr(today);

    return await getProjectDownloads_Analytics(projectIds, new Date(startDate), new Date(endDate));
}

export async function getProjectDownloads_Analytics(projectIds: string[], startDate: Date, endDate: Date) {
    const map = new Map<string, number>();
    if (!projectIds?.length) return map;

    const startDateString = ISO_DateStr(startDate);
    const endDateString = ISO_DateStr(endDate);

    const projectIds_String = projectIds.map((id) => `'${id}'`).join(", ");

    const query = await (
        await clickhouse.query({
            query: `
            SELECT project_id, SUM(downloads_count) AS downloads_count
            FROM ${ANALYTICS_DB}.project_downloads
            WHERE project_id IN (${projectIds_String}) AND date >= '${startDateString}' AND date <= '${endDateString}'
            GROUP BY project_id;
            `,
            format: "JSON",
        })
    ).json();

    const result = query.data as { project_id: string; downloads_count: string }[];
    if (!result?.length) return map;

    for (let i = 0; i < result.length; i++) {
        const record = result[i];

        map.set(record.project_id, Number.parseInt(record.downloads_count));
    }

    return map;
}

interface ProjectDownload_Item {
    projectId: string;
    downloadsCount: number;
    date?: Date;
}

export async function Analytics_InsertProjectDownloads(items: ProjectDownload_Item[]) {
    if (!items?.length) return;

    const formattedItems = [];
    for (const item of items) {
        if (!item.projectId || !item.downloadsCount) continue;

        const dateString = ISO_DateStr(item.date);
        formattedItems.push({
            project_id: item.projectId,
            downloads_count: item.downloadsCount,
            date: dateString,
        });
    }

    try {
        await clickhouse.insert({
            table: `${ANALYTICS_DB}.project_downloads`,
            values: formattedItems,
            format: "JSONEachRow",
        });
    } catch (error) {
        console.error("Error in insertProjectDownloads:", error);
    }
}
