import Redirect from "~/components/ui/redirect";
import { useSession } from "~/hooks/session";
import { ProfileSettingsPage } from "~/pages/settings/profile";
import Config from "~/utils/config";
import { MetaTags } from "~/utils/meta";
import { FormatUrl_WithHintLocale } from "~/utils/urls";

export default function () {
    const session = useSession();

    if (!session?.id) return <Redirect to="/login" />;
    return <ProfileSettingsPage session={session} />;
}

export function meta() {
    return MetaTags({
        title: "Profile settings",
        description: `Your ${Config.SITE_NAME_SHORT} profile settings`,
        image: Config.SITE_ICON,
        url: `${Config.FRONTEND_URL}${FormatUrl_WithHintLocale("settings/profile")}`,
        suffixTitle: true,
    });
}
