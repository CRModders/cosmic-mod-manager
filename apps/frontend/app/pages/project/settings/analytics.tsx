import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@app/components/ui/chart";
import { useTranslation } from "~/locales/provider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@app/components/ui/select";
import { DateFromStr, FormatDate_ToLocaleString, getTimeRange, ISO_DateStr } from "@app/utils/date";
import { FormattedDate } from "~/components/ui/date";
import { TimelineOptions } from "@app/utils/types";
import { formatLocaleCode } from "~/locales";
import { useSearchParams } from "react-router";
import clientFetch from "~/utils/client-fetch";
import type { ProjectDownloads_Analytics } from "@app/utils/types/api/stats";
import { useEffect, useState } from "react";
import { useProjectData } from "~/hooks/project";
import { WanderingCubesSpinner } from "@app/components/ui/spinner";

const timelineKey = "timeline";
const MAX_DATA_POINTS = 50;

interface AnalyticsData_State {
    data: ProjectDownloads_Analytics[string] | null;
    loading: boolean;
}

export default function ProjectAnalyticsPage() {
    const ctx = useProjectData();
    const [searchParams, setSearchParams] = useSearchParams();
    const { t, locale } = useTranslation();
    const [analyticsData, setAnalyticsData] = useState<AnalyticsData_State>({ data: null, loading: true });

    let atLeastOneDataPoint = false;
    const formattedAnalyticsData = Object.entries(analyticsData.data || {}).map((entry) => {
        atLeastOneDataPoint = true;
        return {
            date: entry[0],
            downloads: entry[1],
        };
    });

    const timeline = getValidTimeline(searchParams.get(timelineKey));
    const range = getTimeRange(timeline);

    function setTimeline(timeline: TimelineOptions) {
        setSearchParams(
            (prev) => {
                prev.set(timelineKey, timeline);
                return prev;
            },
            { preventScrollReset: true },
        );
    }

    async function fetchAnalyticsData() {
        setAnalyticsData((prev) => {
            prev.loading = true;
            return prev;
        });

        const data = await getProjectDownload_AnalyticsData(ctx.projectData.id, timeline);
        if (!data) return;

        setAnalyticsData({
            data: formatDownloadAnalyticsData(data, ctx.projectData.id, timeline),
            loading: false,
        });
    }

    const chartConfig = {
        downloads: {
            label: t.project.downloads,
            color: "hsla(var(--chart-1))",
        },
    } satisfies ChartConfig;

    useEffect(() => {
        fetchAnalyticsData();
    }, [timeline, ctx.projectData.id]);

    return (
        <div className="flex gap-4 flex-col bg-card-background rounded-lg p-card-surround ps-0">
            <div className="flex items-start justify-between ps-card-surround">
                <div>
                    <h1 className="text-foreground text-xl font-semibold leading-none">{t.project.downloads}</h1>

                    <span className="text-sm font-semibold text-extra-muted-foreground leading-none">
                        <FormattedDate showTime={false} shortMonthNames date={range[0]} /> -{" "}
                        <FormattedDate showTime={false} shortMonthNames date={range[1]} />
                    </span>
                </div>

                <Select value={timeline} onValueChange={(val) => setTimeline(val as TimelineOptions)}>
                    <SelectTrigger className="w-fit">
                        <SelectValue placeholder="Select timeline" />
                    </SelectTrigger>
                    <SelectContent>
                        {[
                            TimelineOptions.YESTERDAY,
                            TimelineOptions.THIS_WEEK,
                            TimelineOptions.LAST_WEEK,
                            TimelineOptions.PREVIOUS_7_DAYS,
                            TimelineOptions.THIS_MONTH,
                            TimelineOptions.LAST_MONTH,
                            TimelineOptions.PREVIOUS_30_DAYS,
                            TimelineOptions.PREVIOUS_90_DAYS,
                            TimelineOptions.THIS_YEAR,
                            TimelineOptions.LAST_YEAR,
                            TimelineOptions.PREVIOUS_365_DAYS,
                            TimelineOptions.ALL_TIME,
                        ].map((option) => {
                            return (
                                <SelectItem key={option} value={option}>
                                    {t.graph.timeline[option]}
                                </SelectItem>
                            );
                        })}
                    </SelectContent>
                </Select>
            </div>

            <ChartContainer config={chartConfig} className="aspect-auto h-[22rem] w-full">
                {atLeastOneDataPoint ? (
                    <LineChart
                        accessibilityLayer
                        data={formattedAnalyticsData}
                        margin={{
                            left: 12,
                            right: 12,
                        }}
                    >
                        <CartesianGrid vertical={false} stroke="currentColor" className="text-shallow-background" />
                        <XAxis
                            className="text-shallow-background"
                            stroke="currentColor"
                            dataKey="date"
                            tickMargin={8}
                            minTickGap={32}
                            tickFormatter={(value) => {
                                const date = new Date(value);

                                return FormatDate_ToLocaleString(date, {
                                    shortMonthNames: true,
                                    locale: formatLocaleCode(locale),
                                    includeTime: false,
                                    includeYear: false,
                                });
                            }}
                        />
                        <YAxis
                            className="text-shallow-background"
                            stroke="currentColor"
                            dataKey="downloads"
                            width={48}
                            allowDecimals={false}
                        />
                        <ChartTooltip
                            cursor={{
                                stroke: "currentColor",
                                className: "text-shallow-background",
                            }}
                            content={
                                <ChartTooltipContent
                                    color={chartConfig.downloads.color}
                                    nameKey="downloads"
                                    labelFormatter={(value) => {
                                        const date = new Date(value);

                                        return FormatDate_ToLocaleString(date, {
                                            shortMonthNames: true,
                                            locale: formatLocaleCode(locale),
                                            includeTime: false,
                                        });
                                    }}
                                />
                            }
                        />

                        <Line
                            dataKey="downloads"
                            type="monotone"
                            color={chartConfig.downloads.color}
                            stroke="currentColor"
                            activeDot={{
                                color: chartConfig.downloads.color,
                            }}
                            strokeWidth={2.3}
                            dot={false}
                        />
                    </LineChart>
                ) : (
                    <div className="h-full ps-card-surround flex items-center justify-center">
                        {analyticsData.loading ? (
                            <WanderingCubesSpinner />
                        ) : (
                            <span className="text-md text-center font-mono text-extra-muted-foreground">{t.graph.noDataAvailable}</span>
                        )}
                    </div>
                )}
            </ChartContainer>
        </div>
    );
}

function getValidTimeline(timeline: string | null) {
    if (!timeline) return TimelineOptions.PREVIOUS_30_DAYS;

    if (Object.values(TimelineOptions).includes(timeline as TimelineOptions)) {
        return timeline as TimelineOptions;
    }

    return TimelineOptions.PREVIOUS_30_DAYS;
}

async function getProjectDownload_AnalyticsData(projectId: string, timeline: TimelineOptions) {
    const timeRange = getTimeRange(timeline);
    const searchParams = new URLSearchParams();
    searchParams.set("projectIds", JSON.stringify([projectId]));
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

function formatDownloadAnalyticsData(
    data_obj: ProjectDownloads_Analytics | null,
    projectId: string,
    timeline: TimelineOptions,
    _resolutionDays?: number,
) {
    if (!data_obj) return null;

    const data = data_obj[projectId];
    if (!data) return null;

    const timeLineRange = getTimeRange(timeline);
    const keys = Object.keys(data);
    const analytics_StartDate = getStartDate(timeline, timeLineRange[0], DateFromStr(keys[0]));
    const analytics_EndDate = timeLineRange[1];

    if (!analytics_StartDate || !analytics_EndDate) return data;

    const resolutionDays = _resolutionDays ? _resolutionDays : Math.max(1, Math.round(keys.length / MAX_DATA_POINTS));

    while (analytics_EndDate >= analytics_StartDate) {
        const dateKey = ISO_DateStr(analytics_EndDate);
        if (!data[dateKey]) data[dateKey] = 0;

        analytics_EndDate.setDate(analytics_EndDate.getDate() - 1);

        // Aggregate data according to the `resolutionDays`
        for (let i = 0; i < resolutionDays - 1; i++) {
            const nextKey = ISO_DateStr(analytics_EndDate);

            data[dateKey] += data[nextKey] || 0;
            delete data[nextKey];
            analytics_EndDate.setDate(analytics_EndDate.getDate() - 1);
        }
    }

    const entries = Object.entries(data);
    entries.sort((a, b) => {
        return (DateFromStr(a[0]) || 0) > (DateFromStr(b[0]) || 0) ? 1 : -1;
    });

    return Object.fromEntries(entries);
}

function getStartDate(timeline: TimelineOptions, timelineStartDate: Date, firstEntryDate: Date | null) {
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
