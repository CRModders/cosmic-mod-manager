import { addToUsedRateLimit } from "@/middleware/rate-limiter";
import prisma from "@/services/prisma";
import { matchPassword, setUserCookie } from "@/utils";
import httpCode from "@/utils/http";
import { AUTHTOKEN_COOKIE_NAME } from "@shared/config";
import { USER_WRONG_CREDENTIAL_ATTEMPT_CHARGE } from "@shared/config/rate-limit-charges";
import type { LoginFormSchema } from "@shared/schemas/auth";
import { AuthProviders } from "@shared/types";
import type { Context } from "hono";
import type { z } from "zod";
import { createNewUserSession } from "../session";

const credentialSignIn = async (ctx: Context, formData: z.infer<typeof LoginFormSchema>) => {
    const wrongCredsMsg = "Incorrect email or password";

    const user = await prisma.user.findUnique({
        where: {
            email: formData.email,
        },
    });

    if (!user?.id || !user?.password) {
        await addToUsedRateLimit(ctx, USER_WRONG_CREDENTIAL_ATTEMPT_CHARGE);
        return ctx.json({ success: false, message: wrongCredsMsg }, httpCode("bad_request"));
    }
    const isCorrectPassword = await matchPassword(formData.password, user.password);

    if (!isCorrectPassword) {
        await addToUsedRateLimit(ctx, USER_WRONG_CREDENTIAL_ATTEMPT_CHARGE);
        return ctx.json({ success: false, message: wrongCredsMsg }, httpCode("bad_request"));
    }

    const newSession = await createNewUserSession({
        userId: user.id,
        providerName: AuthProviders.CREDENTIAL,
        ctx: ctx,
        isFirstSignIn: false,
        user: user,
    });
    setUserCookie(ctx, AUTHTOKEN_COOKIE_NAME, JSON.stringify(newSession));

    return ctx.json({ success: true, message: `Logged in as ${user.name}` }, httpCode("ok"));
};

export default credentialSignIn;
