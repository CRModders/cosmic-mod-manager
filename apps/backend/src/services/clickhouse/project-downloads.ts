import clickhouse, { ANALYTICS_DB } from "./index";

export async function getLastMonthProjectDownloads(projectIds: string[]) {
    if (!projectIds?.length) return new Map<string, number>();

    const today = new Date();
    const endDate = today.toISOString().split("T")[0];

    // Set the start date back a month
    // *It handles the month overflow or underflow automatically
    today.setMonth(today.getMonth() - 1);
    const startDate = today.toISOString().split("T")[0];

    return await getProjectDownloads_Analytics(projectIds, new Date(startDate), new Date(endDate));
}

export async function getProjectDownloads_Analytics(projectIds: string[], startDate: Date, endDate: Date) {
    const map = new Map<string, number>();
    if (!projectIds?.length) return map;

    const startDateString = startDate.toISOString().split("T")[0];
    const endDateString = endDate.toISOString().split("T")[0];

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
        if (item.downloadsCount < 0) continue;

        const dateString = (item.date || new Date()).toISOString().split("T")[0];
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
