import { FormErrorMessage } from "@/components/ui/form-message";
import { LoadingSpinner } from "@/components/ui/spinner";
import { getCookie } from "@/lib/utils";
import { useSession } from "@/src/contexts/auth";
import useFetch from "@/src/hooks/fetch";
import { CSRF_STATE_COOKIE_NAME, SITE_NAME_SHORT } from "@shared/config";
import { getAuthProviderFromString } from "@shared/lib/utils/convertors";
import { AuthActionIntent, AuthProvider } from "@shared/types";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { toast } from "sonner";

const OAuthCallbackPage = () => {
    const { invalidateSessionQuery } = useSession();
    const [errorMsg, setErrorMsg] = useState("");
    const [searchParams] = useSearchParams();
    const { authProvider } = useParams();
    const navigate = useNavigate();

    const submitCode = async (code: string, provider: AuthProvider, actionIntent: AuthActionIntent) => {
        let redirectUrl = "/dashboard";
        try {
            const response = await useFetch(`/api/auth/${actionIntent}/${provider}`, {
                method: "POST",
                body: JSON.stringify({ code: code }),
            });
            const data = await response.json();

            if (!response?.ok) {
                setErrorMsg(data?.message || "Something went wrong!");
                return;
            }

            invalidateSessionQuery();
            toast.success(data?.message || "Success!");

            redirectUrl = data?.redirect || redirectUrl;
            navigate(redirectUrl);
        } catch (error) {
            console.error(error);
            setErrorMsg(`${error}` || "Something went wrong!");
        }
    };

    const urlCsrfState = searchParams.get("state");
    const code = searchParams.get("code");

    const actionIntent = urlCsrfState?.startsWith(AuthActionIntent.SIGN_IN)
        ? AuthActionIntent.SIGN_IN
        : urlCsrfState?.startsWith(AuthActionIntent.SIGN_UP)
          ? AuthActionIntent.SIGN_UP
          : AuthActionIntent.LINK;

    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    useEffect(() => {
        if (
            urlCsrfState !== getCookie(CSRF_STATE_COOKIE_NAME) ||
            !authProvider ||
            !code ||
            !urlCsrfState ||
            getAuthProviderFromString(authProvider) === AuthProvider.UNKNOWN
        ) {
            return navigate("/");
        }

        submitCode(code, getAuthProviderFromString(authProvider), actionIntent);
    }, [authProvider]);

    return (
        <div className="w-full h-[100vh] min-h-[720px] flex flex-col gap-4 items-center justify-center">
            {errorMsg ? (
                <>
                    <Helmet>
                        <title>Error | {SITE_NAME_SHORT}</title>
                        <meta name="description" content={errorMsg} />
                    </Helmet>
                    <div className="w-full max-w-md flex flex-col gap-4 items-center justify-center">
                        <FormErrorMessage text={errorMsg} />
                        {actionIntent === AuthActionIntent.SIGN_IN ? (
                            <Link className="hover:underline underline-offset-2" to={"/login"}>
                                Log In
                            </Link>
                        ) : actionIntent === AuthActionIntent.SIGN_UP ? (
                            <Link className="hover:underline underline-offset-2" to={"/signup"}>
                                Sign Up
                            </Link>
                        ) : (
                            <Link className="hover:underline underline-offset-2" to={"/settings/account"}>
                                Settings
                            </Link>
                        )}
                    </div>
                </>
            ) : (
                <>
                    <Helmet>
                        <title>... | {SITE_NAME_SHORT}</title>
                        <meta name="description" content="Authenticating..." />
                    </Helmet>
                    <LoadingSpinner />
                </>
            )}
        </div>
    );
};

export const Component = OAuthCallbackPage;
