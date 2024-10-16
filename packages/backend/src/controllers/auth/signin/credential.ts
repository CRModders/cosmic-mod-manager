import { addToUsedApiRateLimit } from "@/middleware/rate-limiter";
import prisma from "@/services/prisma";
import { matchPassword, setUserCookie } from "@/utils";
import { status } from "@/utils/http";
import { AUTHTOKEN_COOKIE_NAMESPACE, USER_SESSION_VALIDITY } from "@shared/config";
import { USER_WRONG_CREDENTIAL_ATTEMPT_CHARGE } from "@shared/config/rate-limit-charges";
import type { LoginFormSchema } from "@shared/schemas/auth";
import { AuthProvider } from "@shared/types";
import type { Context } from "hono";
import type { z } from "zod";
import { createUserSession } from "../helpers/session";

const credentialSignIn = async (ctx: Context, formData: z.infer<typeof LoginFormSchema>) => {
    const wrongCredsMsg = "Incorrect email or password";

    const user = await prisma.user.findUnique({
        where: {
            email: formData.email,
        },
    });

    if (!user?.id || !user?.password) {
        await addToUsedApiRateLimit(ctx, USER_WRONG_CREDENTIAL_ATTEMPT_CHARGE);
        return ctx.json({ success: false, message: wrongCredsMsg }, status.BAD_REQUEST);
    }
    const isCorrectPassword = await matchPassword(formData.password, user.password);

    if (!isCorrectPassword) {
        await addToUsedApiRateLimit(ctx, USER_WRONG_CREDENTIAL_ATTEMPT_CHARGE);
        return ctx.json({ success: false, message: wrongCredsMsg }, status.BAD_REQUEST);
    }

    const newSession = await createUserSession({
        userId: user.id,
        providerName: AuthProvider.CREDENTIAL,
        ctx: ctx,
        isFirstSignIn: false,
        user: user,
    });
    setUserCookie(ctx, AUTHTOKEN_COOKIE_NAMESPACE, newSession, { maxAge: USER_SESSION_VALIDITY });

    return ctx.json({ success: true, message: `Logged in as ${user.name}` }, status.OK);
};

export default credentialSignIn;
