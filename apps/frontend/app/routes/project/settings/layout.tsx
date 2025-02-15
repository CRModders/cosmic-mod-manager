import { isModerator } from "@app/utils/src/constants/roles";
import Redirect from "~/components/ui/redirect";
import { useProjectData } from "~/hooks/project";
import { useSession } from "~/hooks/session";
import ProjectSettingsLayout from "~/pages/project/settings/layout";

export default function _ProjectLayout() {
    const ctx = useProjectData();
    const session = useSession();

    if (!session?.id) return <Redirect to="/login" />;

    const currUsersMembership = ctx.currUsersMembership;
    if (!currUsersMembership && !isModerator(session.role)) return <Redirect to="/" />;

    return <ProjectSettingsLayout />;
}
