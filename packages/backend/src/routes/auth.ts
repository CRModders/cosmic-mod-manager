import { ctxReqBodyNamespace } from "@/../types";
import { getOAuthSignInUrl } from "@/controllers/auth/commons";
import { linkAuthProviderHandler, unlinkAuthProvider } from "@/controllers/auth/link-provider";
import { deleteUserSession, getUserSessions, revokeSessionFromAccessCode } from "@/controllers/auth/session";
import { oAuthSignInHandler } from "@/controllers/auth/signin";
import credentialSignIn from "@/controllers/auth/signin/credential";
import { oAuthSignUpHandler } from "@/controllers/auth/signup";
import { getLinkedAuthProviders } from "@/controllers/user/profile";
import { LoginProtectedRoute } from "@/middleware/session";
import { getUserSessionFromCtx } from "@/utils";
import httpCode, { defaultInvalidReqResponse, defaultServerErrorResponse } from "@/utils/http";
import { authProvidersList } from "@shared/config/project";
import { getAuthProviderFromString, getUserRoleFromString } from "@shared/lib/utils/convertors";
import { LoginFormSchema } from "@shared/schemas/auth";
import { parseValueToSchema } from "@shared/schemas/utils";
import { AuthActionIntent, AuthProvider, type LoggedInUserData } from "@shared/types";
import { type Context, Hono } from "hono";

const authRouter = new Hono();

authRouter.get("/me", currSession_get);

// Routes to get OAuth URL
authRouter.get("/signin/:authProvider", async (ctx: Context) => getOAuthUrlRoute(ctx, AuthActionIntent.SIGN_IN));
authRouter.get("/signup/:authProvider", async (ctx: Context) => getOAuthUrlRoute(ctx, AuthActionIntent.SIGN_UP));
authRouter.get("/link/:authProvider", LoginProtectedRoute, async (ctx: Context) => getOAuthUrlRoute(ctx, AuthActionIntent.LINK));

authRouter.post("/signin/credential", credentialSignin_post); // Sign in with credentials
authRouter.post("/signin/:authProvider", oAuthSignIn_post);
authRouter.post("/signup/:authProvider", oAuthSignUp_post);
authRouter.post("/link/:authProvider", LoginProtectedRoute, oAuthLinkProvider_post);
authRouter.delete("/link/:authProvider", LoginProtectedRoute, oAuthLinkProvider_delete);
authRouter.get("/sessions", LoginProtectedRoute, sessions_get);
authRouter.get("/auth-providers", LoginProtectedRoute, oAuthProviders_get);
authRouter.delete("/sessions", LoginProtectedRoute, sessions_delete);
authRouter.delete("/sessions/:revokeCode", revokeSession_delete);

async function currSession_get(ctx: Context) {
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
        };

        return ctx.json({ data: formattedObject }, httpCode("ok"));
    } catch (error) {
        console.error(error);
        return defaultServerErrorResponse(ctx);
    }
}

async function getOAuthUrlRoute(ctx: Context, intent: AuthActionIntent) {
    try {
        const authProvider = getAuthProviderFromString(ctx.req.param("authProvider"));
        if (!authProvider || authProvider === AuthProvider.UNKNOWN)
            return ctx.json({ success: false, message: "Invalid auth provider" }, httpCode("bad_request"));

        const url = getOAuthSignInUrl(ctx, authProvider, intent);
        return ctx.json({ success: true, url }, httpCode("ok"));
    } catch (error) {
        return defaultServerErrorResponse(ctx);
    }
}

async function credentialSignin_post(ctx: Context) {
    try {
        const { data, error } = await parseValueToSchema(LoginFormSchema, ctx.get(ctxReqBodyNamespace));
        if (error || !data) {
            return ctx.json({ success: false, message: error }, httpCode("bad_request"));
        }

        return await credentialSignIn(ctx, data);
    } catch (err) {
        console.error(err);
        return defaultServerErrorResponse(ctx);
    }
}

async function oAuthSignIn_post(ctx: Context) {
    try {
        if (getUserSessionFromCtx(ctx)?.id) {
            return defaultInvalidReqResponse(ctx);
        }

        const authProvider = ctx.req.param("authProvider");
        const code = ctx.get(ctxReqBodyNamespace)?.code;
        if (!authProvidersList.includes(getAuthProviderFromString(authProvider)) || !code) {
            return defaultInvalidReqResponse(ctx);
        }

        return await oAuthSignInHandler(ctx, authProvider, code);
    } catch (error) {
        console.error(error);
        return defaultServerErrorResponse(ctx);
    }
}

async function oAuthSignUp_post(ctx: Context) {
    try {
        if (getUserSessionFromCtx(ctx)?.id) {
            return defaultInvalidReqResponse(ctx);
        }

        const authProvider = ctx.req.param("authProvider");
        const code = ctx.get(ctxReqBodyNamespace)?.code;
        if (!authProvidersList.includes(getAuthProviderFromString(authProvider)) || !code) {
            return defaultInvalidReqResponse(ctx);
        }

        return await oAuthSignUpHandler(ctx, authProvider, code);
    } catch (error) {
        console.error(error);
        return defaultServerErrorResponse(ctx);
    }
}

async function oAuthLinkProvider_post(ctx: Context) {
    try {
        const userSession = getUserSessionFromCtx(ctx);
        if (!userSession?.id) {
            return defaultInvalidReqResponse(ctx);
        }

        const authProvider = ctx.req.param("authProvider");
        const code = ctx.get(ctxReqBodyNamespace)?.code;
        if (!authProvidersList.includes(getAuthProviderFromString(authProvider)) || !code) {
            return defaultInvalidReqResponse(ctx);
        }

        return await linkAuthProviderHandler(ctx, userSession, authProvider, code);
    } catch (error) {
        console.error(error);
        return defaultServerErrorResponse(ctx);
    }
}

async function oAuthLinkProvider_delete(ctx: Context) {
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
}

async function oAuthProviders_get(ctx: Context) {
    try {
        const userSession = getUserSessionFromCtx(ctx);
        if (!userSession?.id) return ctx.json({}, httpCode("bad_request"));

        return await getLinkedAuthProviders(ctx, userSession);
    } catch (err) {
        console.error(err);
        return defaultServerErrorResponse(ctx);
    }
}

async function sessions_get(ctx: Context) {
    try {
        const userSession = getUserSessionFromCtx(ctx);
        if (!userSession) return ctx.json([], httpCode("ok"));

        return await getUserSessions(ctx, userSession);
    } catch (error) {
        console.error(error);
        return defaultServerErrorResponse(ctx);
    }
}

async function sessions_delete(ctx: Context) {
    try {
        const userSession = getUserSessionFromCtx(ctx);
        const targetSessionId = ctx.get(ctxReqBodyNamespace)?.sessionId || userSession?.sessionId;
        if (!userSession?.id || !targetSessionId)
            return ctx.json({ success: false, message: "Session id is required" }, httpCode("bad_request"));

        return await deleteUserSession(ctx, userSession, targetSessionId);
    } catch (error) {
        console.error(error);
        return defaultServerErrorResponse(ctx);
    }
}

async function revokeSession_delete(ctx: Context) {
    try {
        const code = ctx.req.param("revokeCode");
        if (!code) return ctx.json({ success: false }, httpCode("bad_request"));

        return await revokeSessionFromAccessCode(ctx, code);
    } catch (err) {
        console.error(err);
        return defaultServerErrorResponse(ctx);
    }
}

export default authRouter;
