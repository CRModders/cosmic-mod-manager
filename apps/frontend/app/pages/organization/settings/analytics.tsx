import DownloadsAnalyticsChart from "~/components/downloads-analytics";
import { useOrgData } from "~/hooks/org";

export default function OrganizationAnalyticsPage() {
    const ctx = useOrgData();
    const projects = ctx.orgProjects.map((p) => p.id);

    return <DownloadsAnalyticsChart projectIds={projects} />;
}
