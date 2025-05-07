import Redirect from "~/components/ui/redirect";
import { useSession } from "~/hooks/session";
import SignUpPage from "~/pages/auth/signup/page";
import Config from "~/utils/config";
import { MetaTags } from "~/utils/meta";

export default function () {
    const session = useSession();

    if (session?.id) {
        return <Redirect to="/dashboard" />;
    }
    return <SignUpPage />;
}

export function meta() {
    return MetaTags({
        title: "SignUp",
        description: `Sign up for ${Config.SITE_NAME_SHORT} account`,
        image: Config.SITE_ICON,
        url: `${Config.FRONTEND_URL}/signup`,
        suffixTitle: true,
    });
}
