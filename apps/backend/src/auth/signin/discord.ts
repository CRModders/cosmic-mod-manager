import { secureCookie } from "@root/config";
import { generateRandomCode } from "@root/lib/utils";
import type { Context } from "hono";
import { setCookie } from "hono/cookie";
import type { BlankInput, Env } from "hono/types";

const generateSignInUrl = (state: string): string | undefined => {
    const redirect_uri = encodeURIComponent(`${process.env.SIGNIN_REDIRECT_URI}/discord`);

    return `https://discord.com/oauth2/authorize?scope=identify+email&response_type=code&client_id=${process.env.DISCORD_ID}&redirect_uri=${redirect_uri}&state=${state}`;
};

export default async function discordSigninHandler(c: Context<Env, "/signin/discord", BlankInput>) {
    const state = generateRandomCode(32);
    const signinUrl = generateSignInUrl(state);

    setCookie(c, "oauth-req-state", state, {
        secure: secureCookie,
        domain: process.env.COOKIE_ACCESS_DOMAIN,
    });

    return c.json({ signinUrl });
}
