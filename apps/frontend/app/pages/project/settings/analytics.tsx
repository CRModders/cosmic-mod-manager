import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@app/components/ui/chart";
import { useTranslation } from "~/locales/provider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@app/components/ui/select";
import { FormatDate_ToLocaleString, SubtractDays } from "@app/utils/date";
import { FormattedDate } from "~/components/ui/date";
import { TooltipProvider, TooltipTemplate } from "@app/components/ui/tooltip";
import { TimelineOptions } from "@app/utils/types";
import { formatLocaleCode } from "~/locales";
import { useSearchParams } from "react-router";
import clientFetch from "~/utils/client-fetch";
import type { ProjectDownloads_Analytics } from "@app/utils/types/api/stats";
import { useEffect, useState } from "react";
import { useProjectData } from "~/hooks/project";

const timelineKey = "timeline";

const chartConfig = {
    downloads: {
        label: "Downloads",
        color: "hsla(var(--chart-1))",
    },
} satisfies ChartConfig;

export default function ProjectAnalyticsPage() {
    const ctx = useProjectData();
    const [searchParams, setSearchParams] = useSearchParams();
    const { t, locale } = useTranslation();
    const [analyticsData, setAnalyticsData] = useState<ProjectDownloads_Analytics | null>(null);

    let atLeastOneDataPoint = false;
    const formattedAnalyticsData = Object.entries(analyticsData?.[ctx.projectData.id] || {}).map((entry) => {
        if (entry[1] > 0) atLeastOneDataPoint = true;
        return {
            date: entry[0],
            downloads: entry[1],
        };
    });

    const timeline = getValidTimeline(searchParams.get(timelineKey));
    const range = getTimeRange(timeline);

    function setTimeline(timeline: TimelineOptions) {
        setSearchParams((prev) => {
            prev.set(timelineKey, timeline);
            return prev;
        });
    }

    async function fetchAnalyticsData() {
        const data = await getProjectDownload_AnalyticsData(ctx.projectData.id, timeline);
        if (!data) return;

        setAnalyticsData(data);
    }

    useEffect(() => {
        fetchAnalyticsData();
    }, [timeline, ctx.projectData.id]);

    return (
        <div className="flex gap-4 flex-col bg-card-background rounded-lg p-card-surround ps-0">
            <div className="flex items-start justify-between ps-card-surround">
                <div>
                    <h1 className="text-foreground text-xl font-semibold leading-none">{t.project.downloads}</h1>

                    <TooltipProvider>
                        <TooltipTemplate
                            asChild
                            content={
                                <span>
                                    <FormattedDate showTime={false} shortMonthNames date={range[0]} /> -{" "}
                                    <FormattedDate showTime={false} shortMonthNames date={range[1]} />
                                </span>
                            }
                        >
                            <span className="text-sm font-semibold text-extra-muted-foreground cursor-help leading-none">
                                {t.graph.timeline[timeline]}
                            </span>
                        </TooltipTemplate>
                    </TooltipProvider>
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

            {atLeastOneDataPoint ? (
                <ChartContainer config={chartConfig} className="aspect-auto h-[22rem] w-full">
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
                        <YAxis className="text-shallow-background" stroke="currentColor" dataKey="downloads" width={48} />
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
                                        return new Date(value).toLocaleDateString("en-US", {
                                            month: "short",
                                            day: "numeric",
                                            year: "numeric",
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
                            strokeWidth={2.5}
                            dot={false}
                        />
                    </LineChart>
                </ChartContainer>
            ) : (
                <div className="ps-card-surround flex items-center justify-center">
                    <span className="text-center font-mono text-extra-muted-foreground">{t.graph.noDataAvailable}</span>
                </div>
            )}
        </div>
    );
}

function getTimeRange(timeline: TimelineOptions): [Date, Date] {
    const now = new Date();

    switch (timeline) {
        case TimelineOptions.YESTERDAY:
            return [SubtractDays(now, 1), now];

        case TimelineOptions.THIS_WEEK:
            return [SubtractDays(now, now.getDay()), now];

        case TimelineOptions.LAST_WEEK:
            return [SubtractDays(now, now.getDay() + 7), SubtractDays(now, now.getDay() + 1)];

        case TimelineOptions.PREVIOUS_7_DAYS:
            return [SubtractDays(now, 7), now];

        case TimelineOptions.THIS_MONTH:
            return [new Date(now.getFullYear(), now.getMonth(), 1), now];

        case TimelineOptions.LAST_MONTH:
            return [new Date(now.getFullYear(), now.getMonth() - 1, 1), new Date(now.getFullYear(), now.getMonth(), 0)];

        case TimelineOptions.PREVIOUS_30_DAYS:
            return [SubtractDays(now, 30), now];

        case TimelineOptions.PREVIOUS_90_DAYS:
            return [SubtractDays(now, 90), now];

        case TimelineOptions.THIS_YEAR:
            return [new Date(now.getFullYear(), 0, 1), now];

        case TimelineOptions.LAST_YEAR:
            return [new Date(now.getFullYear() - 1, 0, 1), new Date(now.getFullYear(), 0, 0)];

        case TimelineOptions.PREVIOUS_365_DAYS:
            return [SubtractDays(now, 365), now];

        case TimelineOptions.ALL_TIME:
            return [new Date(0), now];

        default:
            return [SubtractDays(now, 30), now];
    }
}

function getValidTimeline(timeline: string | null) {
    if (!timeline) return TimelineOptions.PREVIOUS_30_DAYS;

    if (Object.values(TimelineOptions).includes(timeline as TimelineOptions)) {
        return timeline as TimelineOptions;
    }

    return TimelineOptions.PREVIOUS_30_DAYS;
}

async function getProjectDownload_AnalyticsData(projectId: string, timeline: TimelineOptions) {
    const searchParams = new URLSearchParams();
    searchParams.set("projectIds", JSON.stringify([projectId]));
    searchParams.set("timeline", timeline);
    const url = `/api/analytics/downloads?${searchParams.toString()}`;
    const res = await clientFetch(url);
    if (!res.ok) {
        console.error("Failed to fetch project download analytics data");
        return null;
    }

    const data = await res.json();
    return data as ProjectDownloads_Analytics;
}
