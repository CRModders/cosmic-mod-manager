import { ctxReqBodyNamespace } from "@/../types";
import { getOAuthSignInUrl } from "@/controllers/auth/commons";
import { linkAuthProviderHandler, unlinkAuthProvider } from "@/controllers/auth/link-provider";
import { logOutUserSession, revokeSessionFromAccessCode } from "@/controllers/auth/session";
import { oAuthSignInHandler } from "@/controllers/auth/signin";
import credentialSignIn from "@/controllers/auth/signin/credential";
import { oAuthSignUpHandler } from "@/controllers/auth/signup";
import { LoginProtectedRoute } from "@/middleware/session";
import { getUserSessionFromCtx } from "@/utils";
import httpCode, { defaultInvalidReqResponse, defaultServerErrorResponse } from "@/utils/http";
import { authProvidersList } from "@shared/config/project";
import { getAuthProviderFromString, getUserRoleFromString } from "@shared/lib/utils/convertors";
import { parseValueToSchema } from "@shared/schemas";
import { LoginFormSchema } from "@shared/schemas/auth";
import { AuthActionIntent, AuthProviders, type LoggedInUserData } from "@shared/types";
import { type Context, Hono } from "hono";

const authRouter = new Hono();

authRouter.get("/me", async (ctx: Context) => {
    try {
        const userSession = getUserSessionFromCtx(ctx);

        if (!userSession) return ctx.json({ message: "You're not logged in!" }, httpCode("unauthenticated"));
        const formattedObject: LoggedInUserData = {
            id: userSession.id,
            email: userSession.email,
            name: userSession.name,
            userName: userSession.userName,
            role: getUserRoleFromString(userSession.role),
            hasAPassword: !!userSession.password,
            avatarUrl: userSession.avatarUrl,
            avatarProvider: getAuthProviderFromString(userSession?.avatarUrlProvider || ""),
            sessionId: userSession.sessionId,
            sessionToken: userSession.sessionToken,
        };

        return ctx.json({ data: formattedObject }, httpCode("ok"));
    } catch (error) {
        console.error(error);
        return defaultServerErrorResponse(ctx);
    }
});

authRouter.get(`/${AuthActionIntent.SIGN_IN}/get-oauth-url/:authProvider`, async (ctx: Context) => {
    try {
        const url = getOAuthSignInUrl(ctx, ctx.req.param("authProvider"), AuthActionIntent.SIGN_IN);
        return ctx.json({ url }, httpCode("ok"));
    } catch (error) {
        return defaultServerErrorResponse(ctx);
    }
});

authRouter.get(`/${AuthActionIntent.SIGN_UP}/get-oauth-url/:authProvider`, async (ctx: Context) => {
    try {
        const url = getOAuthSignInUrl(ctx, ctx.req.param("authProvider"), AuthActionIntent.SIGN_UP);
        return ctx.json({ url }, httpCode("ok"));
    } catch (error) {
        return defaultServerErrorResponse(ctx);
    }
});

authRouter.get(`/${AuthActionIntent.LINK_PROVIDER}/get-oauth-url/:authProvider`, LoginProtectedRoute, async (ctx: Context) => {
    try {
        const url = getOAuthSignInUrl(ctx, ctx.req.param("authProvider"), AuthActionIntent.LINK_PROVIDER);
        return ctx.json({ url }, httpCode("ok"));
    } catch (error) {
        return defaultServerErrorResponse(ctx);
    }
});

authRouter.post(`/${AuthActionIntent.SIGN_IN}/${AuthProviders.CREDENTIAL}`, async (ctx: Context) => {
    try {
        const { data, error } = parseValueToSchema(LoginFormSchema, ctx.get(ctxReqBodyNamespace));
        if (error || !data) {
            return ctx.json({ success: false, message: error }, httpCode("bad_request"));
        }

        return await credentialSignIn(ctx, data);
    } catch (err) {
        console.error(err);
        return defaultServerErrorResponse(ctx);
    }
});

authRouter.get(`/callback/${AuthActionIntent.SIGN_IN}/:authProvider`, async (ctx: Context) => {
    try {
        if (getUserSessionFromCtx(ctx)?.id) {
            return defaultInvalidReqResponse(ctx);
        }

        const authProvider = ctx.req.param("authProvider");
        const code = decodeURIComponent(ctx.req.query("code") || "");
        if (!authProvidersList.includes(getAuthProviderFromString(authProvider)) || !code) {
            return defaultInvalidReqResponse(ctx);
        }

        return await oAuthSignInHandler(ctx, authProvider, code);
    } catch (error) {
        console.error(error);
        return defaultServerErrorResponse(ctx);
    }
});

authRouter.get(`/callback/${AuthActionIntent.SIGN_UP}/:authProvider`, async (ctx: Context) => {
    try {
        if (getUserSessionFromCtx(ctx)?.id) {
            return defaultInvalidReqResponse(ctx);
        }

        const authProvider = ctx.req.param("authProvider");
        const code = decodeURIComponent(ctx.req.query("code") || "");
        if (!authProvidersList.includes(getAuthProviderFromString(authProvider)) || !code) {
            return defaultInvalidReqResponse(ctx);
        }

        return await oAuthSignUpHandler(ctx, authProvider, code);
    } catch (error) {
        console.error(error);
        return defaultServerErrorResponse(ctx);
    }
});

authRouter.get(`/callback/${AuthActionIntent.LINK_PROVIDER}/:authProvider`, LoginProtectedRoute, async (ctx: Context) => {
    try {
        const userSession = getUserSessionFromCtx(ctx);
        if (!userSession?.id) {
            return defaultInvalidReqResponse(ctx);
        }

        const authProvider = ctx.req.param("authProvider");
        const code = decodeURIComponent(ctx.req.query("code") || "");
        if (!authProvidersList.includes(getAuthProviderFromString(authProvider)) || !code) {
            return defaultInvalidReqResponse(ctx);
        }

        return await linkAuthProviderHandler(ctx, userSession, authProvider, code);
    } catch (error) {
        console.error(error);
        return defaultServerErrorResponse(ctx);
    }
});

authRouter.get("/unlink-provider/:authProvider", LoginProtectedRoute, async (ctx: Context) => {
    try {
        const userSession = getUserSessionFromCtx(ctx);
        if (!userSession?.id) {
            return defaultInvalidReqResponse(ctx);
        }

        const authProvider = ctx.req.param("authProvider");
        return unlinkAuthProvider(ctx, userSession, authProvider);
    } catch (error) {
        console.error(error);
        return defaultServerErrorResponse(ctx);
    }
});

authRouter.post("/session/logout", LoginProtectedRoute, async (ctx: Context) => {
    try {
        const userSession = getUserSessionFromCtx(ctx);
        if (!userSession?.id) return ctx.json({}, httpCode("bad_request"));

        const targetSessionId = ctx.get(ctxReqBodyNamespace)?.sessionId || null;

        return await logOutUserSession(ctx, userSession, targetSessionId);
    } catch (error) {
        console.error(error);
        return defaultServerErrorResponse(ctx);
    }
});

authRouter.post("/session/revoke-from-code", async (ctx: Context) => {
    try {
        const code = ctx.get(ctxReqBodyNamespace)?.code;
        if (!code) return ctx.json({ success: false }, httpCode("bad_request"));

        return await revokeSessionFromAccessCode(ctx, code);
    } catch (err) {
        console.error(err);
        return defaultServerErrorResponse(ctx);
    }
});

export default authRouter;
