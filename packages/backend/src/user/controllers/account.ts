import { deleteUserDataCache } from "@/cache/session";
import { addInvalidAuthAttempt } from "@/middleware/rate-limit/invalid-auth-attempt";
import prisma from "@/services/prisma";
import { hashPassword, matchPassword } from "@/src/auth/helpers";
import { getUserFromCtx } from "@/src/auth/helpers/session";
import type { ContextUserData } from "@/types";
import type { RouteHandlerResponse } from "@/types/http";
import { generateConfirmationEmailCode, isConfirmationCodeValid } from "@/utils";
import { sendChangePasswordEmail, sendConfirmNewPasswordEmail, sendDeleteUserAccountEmail } from "@/utils/email";
import { HTTP_STATUS, invalidReqestResponse, invalidReqestResponseData } from "@/utils/http";
import { generateDbId } from "@/utils/str";
import {
    CHANGE_ACCOUNT_PASSWORD_EMAIL_VALIDITY_ms,
    CONFIRM_NEW_PASSWORD_EMAIL_VALIDITY_ms,
    DELETE_USER_ACCOUNT_EMAIL_VALIDITY_ms,
} from "@shared/config";
import { getConfirmActionTypeFromStringName } from "@shared/lib/utils/convertors";
import type {
    removeAccountPasswordFormSchema,
    sendAccoutPasswordChangeLinkFormSchema,
    setNewPasswordFormSchema,
} from "@shared/schemas/settings";
import { ConfirmationType } from "@shared/types";
import type { Context } from "hono";
import type { z } from "zod";

const confirmationEmailValidityDict = {
    [ConfirmationType.CONFIRM_NEW_PASSWORD]: CONFIRM_NEW_PASSWORD_EMAIL_VALIDITY_ms,
    [ConfirmationType.CHANGE_ACCOUNT_PASSWORD]: CHANGE_ACCOUNT_PASSWORD_EMAIL_VALIDITY_ms,
    [ConfirmationType.DELETE_USER_ACCOUNT]: DELETE_USER_ACCOUNT_EMAIL_VALIDITY_ms,
};

export async function addNewPassword_ConfirmationEmail(
    ctx: Context,
    formData: z.infer<typeof setNewPasswordFormSchema>,
): Promise<RouteHandlerResponse> {
    if (formData.newPassword !== formData.confirmNewPassword)
        return { data: { success: false, message: "Passwords do not match" }, status: HTTP_STATUS.BAD_REQUEST };

    const userSession = getUserFromCtx(ctx);
    if (!userSession || userSession.password) return invalidReqestResponseData();

    const hashedPassword = await hashPassword(formData.newPassword);
    const code = generateConfirmationEmailCode(ConfirmationType.CONFIRM_NEW_PASSWORD, userSession.id);

    const confirmationEmail = await prisma.userConfirmation.create({
        data: {
            id: generateDbId(),
            userId: userSession.id,
            confirmationType: ConfirmationType.CONFIRM_NEW_PASSWORD,
            accessCode: code,
            contextData: hashedPassword,
        },
    });

    sendConfirmNewPasswordEmail({
        fullName: userSession.name,
        code: confirmationEmail.accessCode,
        receiverEmail: userSession.email,
    });

    return { data: { message: "You should receive a confirmation email shortly.", success: true }, status: HTTP_STATUS.OK };
}

export const getConfirmActionTypeFromCode = async (ctx: Context, code: string) => {
    const confirmationEmail = await prisma.userConfirmation.findUnique({
        where: {
            accessCode: code,
        },
    });

    const actionType = getConfirmActionTypeFromStringName(confirmationEmail?.confirmationType || "");
    if (!confirmationEmail || !actionType) return ctx.json({ success: false, message: "Invalid or expired code" }, HTTP_STATUS.BAD_REQUEST);

    if (!isConfirmationCodeValid(confirmationEmail.dateCreated, confirmationEmailValidityDict[actionType]))
        return ctx.json({ success: false, message: "Invalid or expired code" }, HTTP_STATUS.BAD_REQUEST);

    return ctx.json({ actionType: actionType, success: true }, HTTP_STATUS.OK);
};

export const deleteConfirmationActionCode = async (ctx: Context, code: string) => {
    const confirmationEmail = await prisma.userConfirmation.findUnique({
        where: { accessCode: code },
    });

    if (!confirmationEmail?.id) return ctx.json({ success: false, message: "Invalid or expired code" }, HTTP_STATUS.BAD_REQUEST);

    await prisma.userConfirmation.deleteMany({
        where: {
            userId: confirmationEmail.userId,
            confirmationType: confirmationEmail.confirmationType,
        },
    });

    return ctx.json({ success: true, message: "Cancelled successfully" }, HTTP_STATUS.OK);
};

export const confirmAddingNewPassword = async (ctx: Context, code: string) => {
    const confirmationEmail = await prisma.userConfirmation.findUnique({
        where: { accessCode: code, confirmationType: ConfirmationType.CONFIRM_NEW_PASSWORD },
        select: {
            id: true,
            userId: true,
            dateCreated: true,
            contextData: true,
            user: {
                select: {
                    password: true,
                },
            },
        },
    });

    if (!confirmationEmail) return ctx.json({ success: false, message: "Invalid or expired code" }, HTTP_STATUS.BAD_REQUEST);
    if (!isConfirmationCodeValid(confirmationEmail.dateCreated, CONFIRM_NEW_PASSWORD_EMAIL_VALIDITY_ms))
        return ctx.json({ success: false, message: "Invalid or expired code" }, HTTP_STATUS.BAD_REQUEST);
    if (confirmationEmail.user.password)
        return ctx.json({ success: false, message: "A password already exists for your account" }, HTTP_STATUS.BAD_REQUEST);

    const user = await prisma.user.update({
        where: {
            id: confirmationEmail.userId,
        },
        data: {
            password: confirmationEmail.contextData,
        },
    });

    await prisma.userConfirmation.deleteMany({
        where: {
            userId: confirmationEmail.userId,
            confirmationType: {
                in: [ConfirmationType.CONFIRM_NEW_PASSWORD, ConfirmationType.CHANGE_ACCOUNT_PASSWORD],
            },
        },
    });
    await deleteUserDataCache(user.id);

    return ctx.json({ success: true, message: "Successfully added the new password" }, HTTP_STATUS.OK);
};

export const removeAccountPassword = async (
    ctx: Context,
    userSession: ContextUserData,
    formData: z.infer<typeof removeAccountPasswordFormSchema>,
) => {
    if (!userSession?.password) {
        await addInvalidAuthAttempt(ctx);
        return ctx.json({ success: false }, HTTP_STATUS.BAD_REQUEST);
    }

    const isCorrectPassword = await matchPassword(formData.password, userSession.password);
    if (!isCorrectPassword) {
        await addInvalidAuthAttempt(ctx);
        return ctx.json({ success: false, message: "Incorrect password" }, HTTP_STATUS.BAD_REQUEST);
    }

    await prisma.user.update({
        where: {
            id: userSession.id,
        },
        data: {
            password: null,
        },
    });
    await deleteUserDataCache(userSession.id);

    return ctx.json({ success: true, message: "Account password removed successfully" }, HTTP_STATUS.OK);
};

export const sendAccountPasswordChangeLink = async (ctx: Context, formData: z.infer<typeof sendAccoutPasswordChangeLinkFormSchema>) => {
    const targetUser = await prisma.user.findUnique({
        where: {
            email: formData.email,
        },
    });

    if (!targetUser?.id) {
        await addInvalidAuthAttempt(ctx);
        return ctx.json(
            {
                success: true,
                message: "You should receive an email with a link to change your password if you entered correct email address.",
            },
            HTTP_STATUS.OK,
        );
    }

    const changePasswordConfirmationEmail = await prisma.userConfirmation.create({
        data: {
            id: generateDbId(),
            userId: targetUser.id,
            confirmationType: ConfirmationType.CHANGE_ACCOUNT_PASSWORD,
            accessCode: generateConfirmationEmailCode(ConfirmationType.CHANGE_ACCOUNT_PASSWORD, targetUser.id),
        },
    });

    sendChangePasswordEmail({
        name: targetUser.name,
        code: changePasswordConfirmationEmail.accessCode,
        receiverEmail: targetUser.email,
    });

    return ctx.json(
        {
            success: true,
            message: "You should receive an email with a link to change your password if you entered correct email address.",
        },
        HTTP_STATUS.OK,
    );
};

export const changeUserPassword = async (ctx: Context, code: string, formData: z.infer<typeof setNewPasswordFormSchema>) => {
    if (formData.newPassword !== formData.confirmNewPassword) return invalidReqestResponse(ctx, "Passwords do not match");

    const confirmationEmail = await prisma.userConfirmation.findUnique({
        where: {
            accessCode: code,
            confirmationType: ConfirmationType.CHANGE_ACCOUNT_PASSWORD,
        },
    });

    if (!confirmationEmail?.id) {
        await addInvalidAuthAttempt(ctx);
        return invalidReqestResponse(ctx);
    }

    if (!confirmationEmail?.userId || !isConfirmationCodeValid(confirmationEmail.dateCreated, CHANGE_ACCOUNT_PASSWORD_EMAIL_VALIDITY_ms)) {
        return invalidReqestResponse(ctx);
    }
    const hashedPassword = await hashPassword(formData.newPassword);

    await prisma.user.update({
        where: {
            id: confirmationEmail.userId,
        },
        data: {
            password: hashedPassword,
        },
    });

    await prisma.userConfirmation.deleteMany({
        where: {
            userId: confirmationEmail.userId,
            confirmationType: {
                in: [ConfirmationType.CHANGE_ACCOUNT_PASSWORD, ConfirmationType.CONFIRM_NEW_PASSWORD],
            },
        },
    });

    return ctx.json({ success: true, message: "Successfully changed account password" }, HTTP_STATUS.OK);
};

export const deleteUserAccountConfirmationEmail = async (ctx: Context, userSession: ContextUserData) => {
    const accountDeletionEmail = await prisma.userConfirmation.create({
        data: {
            id: generateDbId(),
            userId: userSession.id,
            confirmationType: ConfirmationType.DELETE_USER_ACCOUNT,
            accessCode: generateConfirmationEmailCode(ConfirmationType.DELETE_USER_ACCOUNT, userSession.id),
        },
    });

    sendDeleteUserAccountEmail({ fullName: userSession.name, code: accountDeletionEmail.accessCode, receiverEmail: userSession.email });
    return ctx.json({ success: true, message: "You should receive a confirmation email shortly" }, HTTP_STATUS.OK);
};

export const confirmAccountDeletion = async (ctx: Context, code: string) => {
    // const confirmationEmail = await prisma.userConfirmation.findUnique({
    //     where: { accessCode: code, confirmationType: ConfirmationType.DELETE_USER_ACCOUNT },
    // });

    // if (!confirmationEmail?.id || !isConfirmationCodeValid(confirmationEmail.dateCreated, DELETE_USER_ACCOUNT_EMAIL_VALIDITY_ms)) {
    //     return ctx.json({ success: false, message: "Expired or invalid code" }, status.BAD_REQUEST);
    // }

    // await prisma.user.delete({
    //     where: {
    //         id: confirmationEmail.userId,
    //     },
    // });

    // await prisma.userConfirmation.deleteMany({
    //     where: {
    //         userId: confirmationEmail.userId,
    //         confirmationType: ConfirmationType.DELETE_USER_ACCOUNT,
    //     },
    // });

    // deleteUserCookie(ctx, AUTHTOKEN_COOKIE_NAMESPACE);

    // return ctx.json({ success: true, message: `Successfully deleted your ${SITE_NAME_SHORT} account` }, status.OK);

    return ctx.json({ success: false, message: "Method not implemented" }, HTTP_STATUS.SERVER_ERROR);
};
