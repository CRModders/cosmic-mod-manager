import Redirect from "~/components/ui/redirect";
import { useSession } from "~/hooks/session";
import LoginPage from "~/pages/auth/login/page";
import Config from "~/utils/config";
import { MetaTags } from "~/utils/meta";

export default function Login() {
    const session = useSession();

    if (session?.id) return <Redirect to="/dashboard" />;
    return <LoginPage />;
}

export function meta() {
    return MetaTags({
        title: "Login",
        description: `Log into your ${Config.SITE_NAME_SHORT} account to access your projects and dashboard`,
        image: Config.SITE_ICON,
        url: `${Config.FRONTEND_URL}/login`,
        suffixTitle: true,
    });
}
