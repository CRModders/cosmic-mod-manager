import {
    addNewPassword_ConfirmationEmail,
    changeUserPassword,
    confirmAccountDeletion,
    confirmAddingNewPassword,
    deleteConfirmationActionCode,
    deleteUserAccountConfirmationEmail,
    getConfirmActionTypeFromCode,
    removeAccountPassword,
    sendAccountPasswordChangeLink,
} from "@/controllers/user/account";
import { getUserProfileData, updateUserProfile } from "@/controllers/user/profile";
import { addToUsedApiRateLimit } from "@/middleware/rate-limiter";
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

userRouter.get("/", user_get);
userRouter.get("/:slug", user_get);
userRouter.patch("/", LoginProtectedRoute, user_patch);
userRouter.delete("/", user_delete);
userRouter.post("/delete-account", LoginProtectedRoute, deleteAccountConfirmation_post);

userRouter.post("/confirmation-action", userConfirmationAction_post);
userRouter.delete("/confirmation-action", userConfirmationAction_delete);

userRouter.post("/password", LoginProtectedRoute, addPasswordConfirmation_post);
userRouter.put("/password", addPasswordConfirmation_put);
userRouter.delete("/password", LoginProtectedRoute, userPassword_delete);

userRouter.post("/change-password", changePasswordConfirmationEmail_post);
userRouter.patch("/password", userPassword_patch);

// Get currently logged in user
async function user_get(ctx: Context) {
    try {
        const userSession = getUserSessionFromCtx(ctx);
        const slug = ctx.req.param("slug") || userSession?.id;
        if (!slug) return defaultInvalidReqResponse(ctx);

        return await getUserProfileData(ctx, userSession, slug);
    } catch (error) {
        console.error(error);
        return defaultServerErrorResponse(ctx);
    }
}

// Update user profile
async function user_patch(ctx: Context) {
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
}

// Delete user account
async function user_delete(ctx: Context) {
    try {
        const code = ctx.get(ctxReqBodyNamespace)?.code;
        if (!code) {
            await addToUsedApiRateLimit(ctx, CHARGE_FOR_SENDING_INVALID_DATA);
            return defaultInvalidReqResponse(ctx);
        }

        return await confirmAccountDeletion(ctx, code);
    } catch (err) {
        console.error(err);
        return defaultServerErrorResponse(ctx);
    }
}

// Get confirmation action type
async function userConfirmationAction_post(ctx: Context) {
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
}

// Delete confirmation action code
async function userConfirmationAction_delete(ctx: Context) {
    try {
        const code = ctx.get(ctxReqBodyNamespace)?.code;
        if (!code) {
            return ctx.json({ success: false }, httpCode("bad_request"));
        }
        return await deleteConfirmationActionCode(ctx, code);
    } catch (err) {
        console.error(err);
        return defaultServerErrorResponse(ctx);
    }
}

// Send new password confirmation email
async function addPasswordConfirmation_post(ctx: Context) {
    try {
        const { data, error } = await parseValueToSchema(setNewPasswordFormSchema, ctx.get(ctxReqBodyNamespace));
        if (error || !data) {
            return ctx.json({ success: false, message: error }, httpCode("bad_request"));
        }
        return await addNewPassword_ConfirmationEmail(ctx, data);
    } catch (err) {
        console.error(err);
        return defaultServerErrorResponse(ctx);
    }
}

// Add the new password
async function addPasswordConfirmation_put(ctx: Context) {
    try {
        const code = ctx.get(ctxReqBodyNamespace)?.code;
        if (!code) return ctx.json({ success: false }, httpCode("bad_request"));

        return await confirmAddingNewPassword(ctx, code);
    } catch (err) {
        console.error(err);
        return defaultServerErrorResponse(ctx);
    }
}

// Remove user password
async function userPassword_delete(ctx: Context) {
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
}

// Send change password confirmation email
async function changePasswordConfirmationEmail_post(ctx: Context) {
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
}

// Change user password
async function userPassword_patch(ctx: Context) {
    try {
        const { data, error } = await parseValueToSchema(setNewPasswordFormSchema, ctx.get(ctxReqBodyNamespace));
        if (error || !data) {
            return ctx.json({ success: false, message: error }, httpCode("bad_request"));
        }
        const code = ctx.get(ctxReqBodyNamespace)?.code;
        if (!code) {
            return defaultInvalidReqResponse(ctx);
        }
        return await changeUserPassword(ctx, code, data);
    } catch (err) {
        console.error(err);
        return defaultServerErrorResponse(ctx);
    }
}

// Send delete account confirmation email
async function deleteAccountConfirmation_post(ctx: Context) {
    try {
        const userSession = getUserSessionFromCtx(ctx);
        if (!userSession?.id) {
            await addToUsedApiRateLimit(ctx, USER_DELETE_ROUTE_ACCESS_ATTEMPT_CHARGE);
            return defaultInvalidReqResponse(ctx);
        }

        return await deleteUserAccountConfirmationEmail(ctx, userSession);
    } catch (err) {
        console.error(err);
        return defaultServerErrorResponse(ctx);
    }
}

export default userRouter;
