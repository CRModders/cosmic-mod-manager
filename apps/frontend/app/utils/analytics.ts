import { DateFromStr, ISO_DateStr, getTimeRange } from "@app/utils/date";
import { TimelineOptions } from "@app/utils/types";
import type { ProjectDownloads_Analytics } from "@app/utils/types/api/stats";
import clientFetch from "./client-fetch";

export function getValidTimeline(timeline: string | null) {
    if (!timeline) return TimelineOptions.PREVIOUS_30_DAYS;

    if (Object.values(TimelineOptions).includes(timeline as TimelineOptions)) {
        return timeline as TimelineOptions;
    }

    return TimelineOptions.PREVIOUS_30_DAYS;
}

export async function getProjectDownload_AnalyticsData(projectIds: string[], timeline: TimelineOptions) {
    const timeRange = getTimeRange(timeline);
    const searchParams = new URLSearchParams();
    searchParams.set("projectIds", JSON.stringify(projectIds));
    searchParams.set("startDate", ISO_DateStr(timeRange[0]));
    searchParams.set("endDate", ISO_DateStr(timeRange[1]));

    const url = `/api/analytics/downloads?${searchParams.toString()}`;
    const res = await clientFetch(url);
    if (!res.ok) {
        console.error("Failed to fetch project download analytics data");
        return null;
    }

    const data = await res.json();
    return data as ProjectDownloads_Analytics;
}

export function formatDownloadAnalyticsData(
    data_obj: ProjectDownloads_Analytics | null,
    projectIds: string[],
    timeline: TimelineOptions,
    _resolutionDays?: number,
    MAX_DATA_POINTS = 45,
) {
    if (!data_obj) return null;

    const mergedData: Record<string, number> = {};
    for (const projectId of projectIds) {
        const projectAnalyticsData = data_obj[projectId];

        for (const date in projectAnalyticsData) {
            if (!mergedData[date]) mergedData[date] = projectAnalyticsData[date];
            else mergedData[date] += projectAnalyticsData[date] || 0;
        }
    }
    if (!mergedData) return null;

    const timeLineRange = getTimeRange(timeline);
    const keys = Object.keys(mergedData);
    const analytics_StartDate = getStartDate(timeline, timeLineRange[0], DateFromStr(keys[0]));
    const analytics_EndDate = timeLineRange[1];

    if (!analytics_StartDate || !analytics_EndDate) return mergedData;

    const resolutionDays = _resolutionDays ? _resolutionDays : Math.max(1, Math.round(keys.length / MAX_DATA_POINTS));

    while (analytics_EndDate >= analytics_StartDate) {
        const dateKey = ISO_DateStr(analytics_EndDate);
        if (!mergedData[dateKey]) mergedData[dateKey] = 0;

        analytics_EndDate.setDate(analytics_EndDate.getDate() - 1);

        // Aggregate data according to the `resolutionDays`
        for (let i = 0; i < resolutionDays - 1; i++) {
            const nextKey = ISO_DateStr(analytics_EndDate);

            mergedData[dateKey] += mergedData[nextKey] || 0;
            delete mergedData[nextKey];
            analytics_EndDate.setDate(analytics_EndDate.getDate() - 1);
        }
    }

    const entries = Object.entries(mergedData);
    entries.sort((a, b) => {
        return (DateFromStr(a[0]) || 0) > (DateFromStr(b[0]) || 0) ? 1 : -1;
    });

    return Object.fromEntries(entries);
}

export function getStartDate(timeline: TimelineOptions, timelineStartDate: Date, firstEntryDate: Date | null) {
    switch (timeline) {
        case TimelineOptions.YESTERDAY:
        case TimelineOptions.THIS_WEEK:
        case TimelineOptions.LAST_WEEK:
        case TimelineOptions.PREVIOUS_7_DAYS:
        case TimelineOptions.THIS_MONTH:
        case TimelineOptions.LAST_MONTH:
        case TimelineOptions.PREVIOUS_30_DAYS:
            return timelineStartDate;

        case TimelineOptions.PREVIOUS_90_DAYS:
        case TimelineOptions.THIS_YEAR:
        case TimelineOptions.LAST_YEAR:
        case TimelineOptions.PREVIOUS_365_DAYS:
        case TimelineOptions.ALL_TIME:
            return firstEntryDate || timelineStartDate;

        default:
            return timelineStartDate;
    }
}
