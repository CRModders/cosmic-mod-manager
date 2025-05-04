import Redirect from "~/components/ui/redirect";
import { useSession } from "~/hooks/session";
import DashboardLayout from "~/pages/dashboard/layout";
import Config from "~/utils/config";
import { MetaTags } from "~/utils/meta";

export default function _DashboardLayout() {
    const session = useSession();

    if (!session?.id) return <Redirect to="/login" />;
    return <DashboardLayout />;
}

export function meta() {
    return MetaTags({
        title: "Dashboard",
        description: `Your ${Config.SITE_NAME_SHORT} dashboard`,
        image: Config.SITE_ICON,
        url: `${Config.FRONTEND_URL}/dashboard`,
        suffixTitle: true,
    });
}
