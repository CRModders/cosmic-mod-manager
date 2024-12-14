import Config from "@root/utils/config";
import { MetaTags } from "@root/utils/meta";
import { SITE_NAME_SHORT } from "@shared/config";
import Redirect from "~/components/ui/redirect";
import { useSession } from "~/hooks/session";
import LoginPage from "~/pages/auth/login/page";

export default function Login() {
    const session = useSession();

    if (session?.id) return <Redirect to="/dashboard" />;
    return <LoginPage />;
}

export function meta() {
    return MetaTags({
        title: "Login",
        description: `Log into your ${SITE_NAME_SHORT} account to access your projects and dashboard`,
        image: `${Config.FRONTEND_URL}/icon.png`,
        url: `${Config.FRONTEND_URL}/login`,
        suffixTitle: true,
    });
}
