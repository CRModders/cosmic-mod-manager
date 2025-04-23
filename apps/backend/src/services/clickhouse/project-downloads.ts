import clickhouse, { ANALYTICS_DB } from "./index";

export async function getLastMonthProjectDownloads(projectIds: string[]) {
    if (!projectIds?.length) return new Map<string, number>();

    const today = new Date();
    const endDate = today.toISOString().split("T")[0];

    // Set the start date back a month
    if (today.getMonth() > 0) today.setMonth(today.getMonth() - 1);
    else {
        today.setFullYear(today.getFullYear() - 1);
        today.setMonth(11);
    }
    const startDate = today.toISOString().split("T")[0];

    return await getProjectDownloads(projectIds, new Date(startDate), new Date(endDate));
}

export async function getProjectDownloads(projectIds: string[], startDate: Date, endDate: Date) {
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

export async function Analytics_InsertProjectDownloads(projectId: string, downloadsCount: number, customDate?: string) {
    if (!projectId || !downloadsCount) return;

    const date = new Date();
    const dateString = customDate ? customDate : date.toISOString().split("T")[0];

    try {
        await clickhouse.insert({
            table: `${ANALYTICS_DB}.project_downloads`,
            values: [
                {
                    project_id: projectId,
                    downloads_count: downloadsCount,
                    date: dateString,
                },
            ],
            format: "JSONEachRow",
        });
    } catch (error) {
        console.error("Error in insertProjectDownloads:", error);
    }
}
