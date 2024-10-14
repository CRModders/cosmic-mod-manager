import { ctxReqAuthSessionNamespace } from "@/../types";
import { getUserIpAddress } from "@/controllers/auth/helpers";
import { validateContextSession } from "@/controllers/auth/helpers/session";
import { deleteUserCookie, generateRandomString, getUserSessionFromCtx, setUserCookie } from "@/utils";
import { defaultServerErrorResponse, status } from "@/utils/http";
import { GUEST_SESSION_ID_VALIDITY } from "@shared/config";
import { PROTECTED_ROUTE_ACCESS_ATTEMPT_CHARGE } from "@shared/config/rate-limit-charges";
import type { Context, Next } from "hono";
import { getCookie } from "hono/cookie";
import { addToUsedApiRateLimit } from "./rate-limiter";

export const AuthenticationMiddleware = async (ctx: Context, next: Next) => {
    const user = await validateContextSession(ctx);
    const ipAddr = getUserIpAddress(ctx);

    if (!user) {
        if (!getCookie(ctx, "guest-session")) {
            const randomId = generateRandomString(32);
            setUserCookie(ctx, "guest-session", randomId, { maxAge: GUEST_SESSION_ID_VALIDITY });
            ctx.set("guest-session", randomId);
        } else {
            ctx.set("guest-session", getCookie(ctx, "guest-session"));
        }
    } else {
        deleteUserCookie(ctx, "guest-session");
    }

    ctx.set(ctxReqAuthSessionNamespace, user);
    ctx.set("ip", ipAddr);
    await next();
};

export const LoginProtectedRoute = async (ctx: Context, next: Next) => {
    try {
        const session = getUserSessionFromCtx(ctx);
        if (!session?.id) {
            await addToUsedApiRateLimit(ctx, PROTECTED_ROUTE_ACCESS_ATTEMPT_CHARGE);
            return ctx.json({ success: false, message: "You're not logged in" }, status.UNAUTHENTICATED);
        }

        await next();
    } catch (error) {
        console.error(error);
        return defaultServerErrorResponse(ctx);
    }
};
