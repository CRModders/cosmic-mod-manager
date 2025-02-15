import { SITE_NAME_SHORT } from "@app/utils/constants";
import ChangePasswordPage from "~/pages/auth/change-password";
import Config from "~/utils/config";
import { MetaTags } from "~/utils/meta";

export default function _ChangePassword() {
    return <ChangePasswordPage />;
}

export function meta() {
    return MetaTags({
        title: "Change password",
        description: `Change your ${SITE_NAME_SHORT} account password`,
        image: `${Config.FRONTEND_URL}/icon.png`,
        url: `${Config.FRONTEND_URL}/change-password`,
        suffixTitle: true,
    });
}
