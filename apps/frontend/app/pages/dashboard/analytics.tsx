import DownloadsAnalyticsChart from "~/components/downloads-analytics";

export default function DashboardAnalyticsPage({ userProjects }: { userProjects: string[] }) {
    return <DownloadsAnalyticsChart projectIds={userProjects} />;
}
