import {
    addNewPassword,
    cancelAccountDeletion,
    cancelAddingNewPassword,
    cancelSettingNewPassword,
    confirmAccountDeletion,
    confirmAddingNewPassword,
    deleteUserAccount,
    getConfirmActionTypeFromCode,
    removeAccountPassword,
    sendAccountPasswordChangeLink,
    setNewPassword,
} from "@/controllers/user/account";
import {
    getAllSessions,
    getAllVisibleProjects,
    getLinkedAuthProviders,
    getUserProfileData,
    updateUserProfile,
} from "@/controllers/user/profile";
import { addToUsedRateLimit } from "@/middleware/rate-limiter";
import { LoginProtectedRoute } from "@/middleware/session";
import { getUserSessionFromCtx } from "@/utils";
import httpCode, { defaultInvalidReqResponse, defaultServerErrorResponse } from "@/utils/http";
import { CHARGE_FOR_SENDING_INVALID_DATA, USER_DELETE_ROUTE_ACCESS_ATTEMPT_CHARGE } from "@shared/config/rate-limit-charges";
import {
    profileUpdateFormSchema,
    removeAccountPasswordFormSchema,
    sendAccoutPasswordChangeLinkFormSchema,
    setNewPasswordFormSchema,
} from "@shared/schemas/settings";
import { parseValueToSchema } from "@shared/schemas/utils";
import { type Context, Hono } from "hono";
import { ctxReqBodyNamespace } from "../../types";

const userRouter = new Hono();

userRouter.get("/_/:slug", async (ctx: Context) => {
    try {
        const slug = ctx.req.param("slug");
        if (!slug) return defaultInvalidReqResponse(ctx);
        const userSession = getUserSessionFromCtx(ctx);

        return await getUserProfileData(ctx, userSession, slug);
    } catch (error) {
        console.error(error);
        return defaultServerErrorResponse(ctx);
    }
});

userRouter.get("/_/:slug/projects", async (ctx: Context) => {
    try {
        const slug = ctx.req.param("slug");
        const listedProjectsOnly = ctx.req.query("listedOnly") === "true";
        if (!slug) return defaultInvalidReqResponse(ctx);
        const userSession = getUserSessionFromCtx(ctx);

        return await getAllVisibleProjects(ctx, userSession, slug, listedProjectsOnly);
    } catch (error) {
        console.error(error);
        return defaultServerErrorResponse(ctx);
    }
});

userRouter.get("/projects", async (ctx: Context) => {
    try {
        const listedProjectsOnly = ctx.req.query("listedOnly") === "true";
        const userSession = getUserSessionFromCtx(ctx);
        const userName = userSession?.userName;
        if (!userName) return ctx.json({ success: false, message: "You're not logged in" }, httpCode("unauthenticated"));

        return await getAllVisibleProjects(ctx, userSession, userName, listedProjectsOnly);
    } catch (error) {
        console.error(error);
        return defaultServerErrorResponse(ctx);
    }
});

userRouter.post("/update-profile", LoginProtectedRoute, async (ctx: Context) => {
    try {
        const { data, error } = await parseValueToSchema(profileUpdateFormSchema, ctx.get(ctxReqBodyNamespace));
        if (error || !data) {
            return ctx.json({ success: false, message: error }, httpCode("bad_request"));
        }
        return updateUserProfile(ctx, data);
    } catch (err) {
        console.error(err);
        return defaultServerErrorResponse(ctx);
    }
});

userRouter.get("/get-linked-auth-providers", LoginProtectedRoute, async (ctx: Context) => {
    try {
        const userSession = getUserSessionFromCtx(ctx);
        if (!userSession?.id) return ctx.json({}, httpCode("bad_request"));

        return await getLinkedAuthProviders(ctx, userSession);
    } catch (err) {
        console.error(err);
        return defaultServerErrorResponse(ctx);
    }
});

userRouter.post("/add-new-password", LoginProtectedRoute, async (ctx: Context) => {
    try {
        const { data, error } = await parseValueToSchema(setNewPasswordFormSchema, ctx.get(ctxReqBodyNamespace));
        if (error || !data) {
            return ctx.json({ success: false, message: error }, httpCode("bad_request"));
        }
        return await addNewPassword(ctx, data);
    } catch (err) {
        console.error(err);
        return defaultServerErrorResponse(ctx);
    }
});

userRouter.post("/get-confirm-action-type", async (ctx: Context) => {
    try {
        const code = ctx.get(ctxReqBodyNamespace)?.code;
        if (!code) {
            return ctx.json({ success: false }, httpCode("bad_request"));
        }
        return await getConfirmActionTypeFromCode(ctx, code);
    } catch (err) {
        console.error(err);
        return defaultServerErrorResponse(ctx);
    }
});

userRouter.post("/cancel-adding-new-password", async (ctx: Context) => {
    try {
        const code = ctx.get(ctxReqBodyNamespace)?.code;
        if (!code) {
            return ctx.json({ success: false }, httpCode("bad_request"));
        }
        return await cancelAddingNewPassword(ctx, code);
    } catch (err) {
        console.error(err);
        return defaultServerErrorResponse(ctx);
    }
});

userRouter.post("/confirm-adding-new-password", async (ctx: Context) => {
    try {
        const code = ctx.get(ctxReqBodyNamespace)?.code;
        if (!code) return ctx.json({ success: false }, httpCode("bad_request"));

        return await confirmAddingNewPassword(ctx, code);
    } catch (err) {
        console.error(err);
        return defaultServerErrorResponse(ctx);
    }
});

userRouter.post("/remove-account-password", LoginProtectedRoute, async (ctx: Context) => {
    try {
        const { data, error } = await parseValueToSchema(removeAccountPasswordFormSchema, ctx.get(ctxReqBodyNamespace));
        if (error || !data) {
            return ctx.json({ success: false, message: error }, httpCode("bad_request"));
        }

        const userSession = getUserSessionFromCtx(ctx);
        if (!userSession || !userSession?.password) return ctx.json({}, httpCode("bad_request"));

        return await removeAccountPassword(ctx, userSession, data);
    } catch (err) {
        console.error(err);
        return defaultServerErrorResponse(ctx);
    }
});

userRouter.post("/send-password-change-email", async (ctx: Context) => {
    try {
        const { data, error } = await parseValueToSchema(sendAccoutPasswordChangeLinkFormSchema, ctx.get(ctxReqBodyNamespace));
        if (error || !data) {
            return ctx.json({ success: false, message: error }, httpCode("bad_request"));
        }
        return await sendAccountPasswordChangeLink(ctx, data);
    } catch (err) {
        console.error(err);
        return defaultServerErrorResponse(ctx);
    }
});

userRouter.post("/cancel-settings-new-password", async (ctx: Context) => {
    try {
        const code = ctx.get(ctxReqBodyNamespace)?.code;
        if (!code) {
            return defaultInvalidReqResponse(ctx);
        }
        return await cancelSettingNewPassword(ctx, code);
    } catch (err) {
        console.error(err);
        return defaultServerErrorResponse(ctx);
    }
});

userRouter.post("/set-new-password", async (ctx: Context) => {
    try {
        const { data, error } = await parseValueToSchema(setNewPasswordFormSchema, ctx.get(ctxReqBodyNamespace));
        if (error || !data) {
            return ctx.json({ success: false, message: error }, httpCode("bad_request"));
        }
        const code = ctx.get(ctxReqBodyNamespace)?.code;
        if (!code) {
            return defaultInvalidReqResponse(ctx);
        }
        return await setNewPassword(ctx, code, data);
    } catch (err) {
        console.error(err);
        return defaultServerErrorResponse(ctx);
    }
});

userRouter.post("/delete-account", LoginProtectedRoute, async (ctx: Context) => {
    try {
        const userSession = getUserSessionFromCtx(ctx);
        if (!userSession?.id) {
            await addToUsedRateLimit(ctx, USER_DELETE_ROUTE_ACCESS_ATTEMPT_CHARGE);
            return defaultInvalidReqResponse(ctx);
        }

        return await deleteUserAccount(ctx, userSession);
    } catch (err) {
        console.error(err);
        return defaultServerErrorResponse(ctx);
    }
});

userRouter.post("/cancel-account-deletion", async (ctx: Context) => {
    try {
        const code = ctx.get(ctxReqBodyNamespace)?.code;
        if (!code) {
            await addToUsedRateLimit(ctx, CHARGE_FOR_SENDING_INVALID_DATA);
            return defaultInvalidReqResponse(ctx);
        }

        return await cancelAccountDeletion(ctx, code);
    } catch (err) {
        console.error(err);
        return defaultServerErrorResponse(ctx);
    }
});

userRouter.post("/confirm-account-deletion", async (ctx: Context) => {
    try {
        const code = ctx.get(ctxReqBodyNamespace)?.code;
        if (!code) {
            await addToUsedRateLimit(ctx, CHARGE_FOR_SENDING_INVALID_DATA);
            return defaultInvalidReqResponse(ctx);
        }

        return await confirmAccountDeletion(ctx, code);
    } catch (err) {
        console.error(err);
        return defaultServerErrorResponse(ctx);
    }
});

userRouter.get("/get-all-sessions", LoginProtectedRoute, async (ctx: Context) => {
    try {
        const userSession = getUserSessionFromCtx(ctx);
        if (!userSession) return ctx.json([], httpCode("ok"));

        return await getAllSessions(ctx, userSession);
    } catch (error) {
        console.error(error);
        return defaultServerErrorResponse(ctx);
    }
});

export default userRouter;
