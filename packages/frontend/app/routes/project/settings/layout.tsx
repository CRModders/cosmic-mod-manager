import { isModerator } from "@shared/config/roles";
import { useOutletContext } from "react-router";
import Redirect from "~/components/ui/redirect";
import ProjectSettingsLayout from "~/pages/project/settings/layout";
import type { ProjectDataWrapperContext } from "~/routes/project/data-wrapper";

export default function _ProjectLayout() {
    const data = useOutletContext<ProjectDataWrapperContext>();

    const session = data.session;
    if (!session?.id) return <Redirect to="/login" />;

    const currUsersMembership = data.currUsersMembership;
    if (!currUsersMembership && !isModerator(session.role)) return <Redirect to="/" />;

    return <ProjectSettingsLayout session={session} projectData={data.projectData} currUsersMembership={currUsersMembership} />;
}
