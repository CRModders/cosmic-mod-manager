import DownloadsAnalyticsChart from "~/components/downloads-analytics";

function AllProjectsAnalyticsURL(searchParams: URLSearchParams) {
    return `/api/analytics/downloads/all?${searchParams.toString()}`;
}

export default function AllProjectDownloadAnalytics() {
    return <DownloadsAnalyticsChart projectIds={[]} customUrlFunc={AllProjectsAnalyticsURL} />;
}
