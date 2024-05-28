import { Spinner } from "@/components/ui/spinner";
import { redirectToMessagePage } from "@/lib/utils";
import useFetch from "@/src/hooks/fetch";
import { AuthContext } from "@/src/providers/auth-provider";
import { useContext, useEffect } from "react";
import { useCookies } from "react-cookie";
import { Helmet } from "react-helmet";
import { useParams } from "react-router-dom";
import { authConfig } from "../auth";

export const SignInCallbackPage = () => {
	const { authProvider } = useParams();
	const { handleOAuthCallback } = useContext(AuthContext);
	const [cookies] = useCookies();

	type Options = {
		code: string | null;
		localCookieState: string | null;
		urlCallbackState: string | null;
		codeVerifier: string | null;
		codeChallenge: string | null;
	};

	const sendDataToServer = async ({
		code,
		localCookieState,
		urlCallbackState,
		codeVerifier,
		codeChallenge,
	}: Options) => {
		const fetchReq = useFetch(`${authConfig.basePath}/callback/${authProvider}`, {
			method: "POST",
			body: JSON.stringify({ code, localCookieState, urlCallbackState, codeVerifier, codeChallenge }),
		});

		const result = await handleOAuthCallback(fetchReq);

		if (result?.success !== true) {
			redirectToMessagePage(result?.message, "error", "/login", "Back to Login page");
		} else {
			redirectToMessagePage(result?.message, "success", "/", "Home page");
		}
	};

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		const searchParams = new URLSearchParams(window.location.search);
		const code = searchParams.get("code");
		const urlCallbackState = searchParams.get("state");

		const codeVerifier = cookies["code-verifier"];
		const codeChallenge = cookies["code-challenge"];
		const localCookieState = cookies["oauth-req-state"];

		if (code?.length && code.length > 1 && localCookieState === urlCallbackState) {
			sendDataToServer({ code, localCookieState, urlCallbackState, codeVerifier, codeChallenge });
		} else if (!code || code.length < 1) {
			redirectToMessagePage("Token is invalid or is blank!", "error", "/login", "Back to Login page");
		} else if (localCookieState !== urlCallbackState) {
			redirectToMessagePage("Local state and url state doesn't match.", "error", "/login", "Back to Login page");
		}
	}, []);

	return (
		<div className="w-full min-h-[100vh] flex items-center justify-center">
			<Helmet>
				<title>Signing in... | CRMM</title>
				<meta name="description" content="Your verification token is either invalid or expired." />
			</Helmet>
			<div className="max-w-xl flex items-center justify-center gap-4 flex-col p-8">
				<Spinner size="2rem" />
			</div>
		</div>
	);
};
