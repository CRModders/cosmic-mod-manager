import ChangePasswordPage from "~/pages/auth/change-password";
import Config from "~/utils/config";
import { MetaTags } from "~/utils/meta";

export default function _ChangePassword() {
    return <ChangePasswordPage />;
}

export function meta() {
    return MetaTags({
        title: "Change password",
        description: `Change your ${Config.SITE_NAME_SHORT} account password`,
        image: Config.SITE_ICON,
        url: `${Config.FRONTEND_URL}/change-password`,
        suffixTitle: true,
    });
}
