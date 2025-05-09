import DownloadsAnalyticsChart from "~/components/downloads-analytics";
import { useProjectData } from "~/hooks/project";

export default function ProjectAnalyticsPage() {
    const ctx = useProjectData();

    return <DownloadsAnalyticsChart projectIds={[ctx.projectData.id]} />;
}
