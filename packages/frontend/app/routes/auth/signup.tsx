import Config from "@root/utils/config";
import { MetaTags } from "@root/utils/meta";
import { SITE_NAME_SHORT } from "@shared/config";
import Redirect from "~/components/ui/redirect";
import { useSession } from "~/hooks/session";
import SignUpPage from "~/pages/auth/signup/page";

export default function _SignUp() {
    const session = useSession();

    if (session?.id) {
        return <Redirect to="/dashboard" />;
    }
    return <SignUpPage />;
}

export function meta() {
    return MetaTags({
        title: "SignUp",
        description: `Sign up for ${SITE_NAME_SHORT} account`,
        image: `${Config.FRONTEND_URL}/icon.png`,
        url: `${Config.FRONTEND_URL}/signup`,
        suffixTitle: true,
    });
}
