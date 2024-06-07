import { generateRandomCode } from "@/lib/utils";
import { secureCookie } from "@root/config";
import type { Context } from "hono";
import { setCookie } from "hono/cookie";
import type { BlankInput, Env } from "hono/types";

const generateSignInUrl = (state: string): string | undefined => {
	const redirect_uri = encodeURIComponent(`${process.env.SIGNIN_REDIRECT_URI}/gitlab`);

	return `https://gitlab.com/oauth/authorize?scope=read_user&response_type=code&client_id=${process.env.GITLAB_ID}&redirect_uri=${redirect_uri}&state=${state}`;
};

export default async function gitlabSigninHandler(c: Context<Env, "/signin/gitlab", BlankInput>) {
	const state = generateRandomCode(32);
	const signinUrl = generateSignInUrl(state);

	setCookie(c, "oauth-req-state", state, {
		secure: secureCookie,
		domain: process.env.COOKIE_ACCESS_DOMAIN,
	});

	return c.json({ signinUrl });
}
