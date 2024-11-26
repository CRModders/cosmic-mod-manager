import { useParams, useSearchParams } from "@remix-run/react";
import OAuthCallbackPage from "~/pages/auth/callback/page";

export default function _AuthCallback() {
    const params = useParams();
    const [searchParams] = useSearchParams();

    const authProvider = params.authProvider || null;
    const csrfState = searchParams.get("state") || null;
    const code = searchParams.get("code") || null;

    return <OAuthCallbackPage authProvider={authProvider} csrfState={csrfState} code={code} />;
}
