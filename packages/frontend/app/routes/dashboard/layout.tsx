import Config from "@root/utils/config";
import { MetaTags } from "@root/utils/meta";
import { SITE_NAME_SHORT } from "@shared/config";
import { useOutletContext } from "react-router";
import Redirect from "~/components/ui/redirect";
import { WanderingCubesSpinner } from "~/components/ui/spinner";
import DashboardLayout from "~/pages/dashboard/layout";
import type { RootOutletData } from "~/root";

export default function _DashboardLayout() {
    const context = useOutletContext<RootOutletData>();

    if (!context.session?.id) return <Redirect to="/login" />;
    return <DashboardLayout outletContext={context} />;
}

export function HydrateFallback() {
    return <WanderingCubesSpinner />;
}

export function meta() {
    return MetaTags({
        title: "Dashboard",
        description: `Your ${SITE_NAME_SHORT} dashboard`,
        image: `${Config.FRONTEND_URL}/icon.png`,
        url: `${Config.FRONTEND_URL}/dashboard`,
        suffixTitle: true,
    });
}
