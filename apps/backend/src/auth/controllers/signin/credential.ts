import { USER_SESSION_VALIDITY } from "@app/utils/config";
import type { LoginFormSchema } from "@app/utils/schemas/auth";
import { AuthProvider } from "@app/utils/types";
import type { Context } from "hono";
import type { z } from "zod";
import { addInvalidAuthAttempt } from "~/middleware/rate-limit/invalid-auth-attempt";
import prisma from "~/services/prisma";
import { matchPassword } from "~/src/auth/helpers";
import { createUserSession, setSessionCookie } from "~/src/auth/helpers/session";
import type { RouteHandlerResponse } from "~/types/http";
import { AUTH_COOKIE_NAMESPACE } from "~/types/namespaces";
import { HTTP_STATUS } from "~/utils/http";

const credentialSignIn = async (ctx: Context, formData: z.infer<typeof LoginFormSchema>): Promise<RouteHandlerResponse> => {
    const wrongCredsMsg = "Incorrect email or password";

    const user = await prisma.user.findUnique({
        where: {
            email: formData.email,
        },
    });

    if (!user?.id || !user?.password) {
        await addInvalidAuthAttempt(ctx);
        return {
            data: { success: false, message: wrongCredsMsg },
            status: HTTP_STATUS.BAD_REQUEST,
        };
    }
    const isCorrectPassword = await matchPassword(formData.password, user.password);

    if (!isCorrectPassword) {
        await addInvalidAuthAttempt(ctx);
        return {
            data: { success: false, message: wrongCredsMsg },
            status: HTTP_STATUS.BAD_REQUEST,
        };
    }

    const newSession = await createUserSession({
        userId: user.id,
        providerName: AuthProvider.CREDENTIAL,
        ctx: ctx,
        isFirstSignIn: false,
        user: user,
    });
    setSessionCookie(ctx, AUTH_COOKIE_NAMESPACE, newSession, { maxAge: USER_SESSION_VALIDITY });

    return {
        data: { success: true, message: `Logged in as ${user.name}` },
        status: HTTP_STATUS.OK,
    };
};

export default credentialSignIn;
