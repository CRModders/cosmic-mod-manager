import { Navigate, useOutletContext } from "@remix-run/react";
import Config from "@root/utils/config";
import { MetaTags } from "@root/utils/meta";
import { SITE_NAME_SHORT } from "@shared/config";
import LoginPage from "~/pages/auth/login/page";
import type { RootOutletData } from "~/routes/layout";

export default function Login() {
    const { session } = useOutletContext<RootOutletData>();

    if (session?.id) return <Navigate to="/dashboard" />;
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
