import Config from "@root/utils/config";
import { MetaTags } from "@root/utils/meta";
import { SITE_NAME_SHORT } from "@shared/config";
import { useOutletContext } from "react-router";
import Redirect from "~/components/ui/redirect";
import { ProfileSettingsPage } from "~/pages/settings/profile";
import type { RootOutletData } from "~/root";

export default function _AccountSettings() {
    const { session } = useOutletContext<RootOutletData>();

    if (!session?.id) return <Redirect to="/login" />;
    return <ProfileSettingsPage session={session} />;
}

export function meta() {
    return MetaTags({
        title: "Profile settings",
        description: `Your ${SITE_NAME_SHORT} profile settings`,
        image: `${Config.FRONTEND_URL}/icon.png`,
        url: `${Config.FRONTEND_URL}/settings/profile`,
        suffixTitle: true,
    });
}
