import { generateRandomCode } from "@/lib/utils";
import type { Context } from "hono";
import { setCookie } from "hono/cookie";
import type { BlankInput, Env } from "hono/types";

const generateSignInUrl = (state: string): string | undefined => {
	const redirect_uri = encodeURIComponent(`${process.env.SIGNIN_REDIRECT_URI}/github`);
	return `https://github.com/login/oauth/authorize?&response_type=code&client_id=${encodeURIComponent(
		process.env.GITHUB_ID,
	)}&redirect_uri=${redirect_uri}&scope=${encodeURIComponent("read:user user:email")}&state=${state}`;
};

export default async function githubSigninHandler(c: Context<Env, "/signin/github", BlankInput>) {
	const state = generateRandomCode(32);
	const signinUrl = generateSignInUrl(state);

	setCookie(c, "oauth-req-state", state, {
		secure: true,
	});

	return c.json({ signinUrl });
}
