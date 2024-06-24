import prisma from "@/lib/prisma";
import { type Account, UserVerificationActionTypes, type VerificationRequest } from "@prisma/client";
import {
    addNewPasswordVerificationTokenValidity,
    changePasswordConfirmationTokenValidity,
    deleteAccountVerificationTokenValidity,
} from "@root/config";
import { isValidName, isValidPassword, isValidUsername } from "@root/lib/user";
import { password } from "bun";
import { Hono } from "hono";
import { getUserSession, isVerificationTokenValid } from "../helpers/auth";
import {
    sendAccountDeletionConfirmationEmail,
    sendNewPasswordVerificationEmail,
    sendPasswordChangeEmail,
} from "../helpers/send-emails";
import { deleteAllUserFiles } from "../helpers/storage";
import { hashPassword, isUsernameAvailable, matchPassword } from "../helpers/user-profile";
const userRouter = new Hono();

// * Returns an array of all the oAuth providers linked to the account
userRouter.get("/linked-auth-providers", async (c) => {
    try {
        const [user] = await getUserSession(c);
        if (!user?.id) {
            return c.json(
                {
                    success: false,
                    message: "Unauthenticated request",
                    data: [],
                },
                403,
            );
        }

        const linkedProviders = await prisma.account.findMany({
            where: {
                user_id: user?.id,
            },
        });

        const list: Partial<Account>[] = [];
        for (const provider of linkedProviders) {
            list.push({
                provider: provider.provider,
                provider_account_email: provider.provider_account_email,
            });
        }

        return c.json({
            success: true,
            data: list,
        });
    } catch (error) {
        console.error(error);
        return c.json(
            {
                success: false,
                message: "Internal server error",
                data: [],
            },
            500,
        );
    }
});

// * Route handler to update user profile data
userRouter.post("/edit-profile", async (c) => {
    try {
        const data = await c.req.json();

        const name = data?.name;
        const user_name = data?.user_name;
        const avatar_provider = data?.avatar_provider;

        // make sure the values aren't missing
        if (!name && !user_name && !avatar_provider) {
            return c.json(
                {
                    success: false,
                    message: "Invalid form data",
                },
                400,
            );
        }

        // check if the username is of valid format
        if (isValidUsername(user_name || "") !== true) {
            const error = isValidUsername(user_name || "");
            return c.json(
                {
                    success: false,
                    message: error.toString(),
                },
                400,
            );
        }

        // check if the name is of valid format
        if (isValidName(name || "") !== true) {
            const error = isValidName(name || "");
            return c.json(
                {
                    success: false,
                    message: error.toString(),
                },
                400,
            );
        }
        // Get the current logged in user from the cookie data
        const [user] = await getUserSession(c);
        if (!user?.id) {
            return c.json(
                {
                    success: false,
                    message: "Unauthenticated request",
                },
                403,
            );
        }

        // If the username has changed check if it's available or not
        const userNameAvailable = user_name === user?.user_name ? true : await isUsernameAvailable(user_name);
        if (userNameAvailable !== true) {
            return c.json(
                {
                    success: false,
                    message: "This user name is not available",
                },
                400,
            );
        }

        // If the avatar provider has changed, set the avatar image to the new image
        let new_avatar_image = user.avatar_image;
        if (avatar_provider && avatar_provider !== user.avatar_image_provider) {
            const account = await prisma.account.findFirst({
                where: {
                    provider: avatar_provider,
                    user_id: user.id,
                },
                select: {
                    avatar_image: true,
                },
            });

            new_avatar_image = account?.avatar_image || new_avatar_image;
        }

        // Finally update the user table
        const someData = await prisma.user.update({
            where: {
                id: user.id,
            },
            data: {
                name: name,
                user_name: user_name,
                avatar_image_provider: avatar_provider,
                avatar_image: new_avatar_image,
            },
        });

        return c.json({
            success: true,
            message: "Profile updated successfully",
            updatedData: {
                name: name,
                user_name: user_name,
                avatar_provider: avatar_provider,
                avatar_image: new_avatar_image,
            },
        });
    } catch (error) {
        console.error(error);
        return c.json(
            {
                success: false,
                message: "Internal server error",
            },
            500,
        );
    }
});

// * Initiates the process of adding a new password to the account
userRouter.post("/add-new-password", async (c) => {
    try {
        const data = await c.req.json();
        const new_password = data?.new_password;

        if (isValidPassword(new_password) !== true) {
            const error = isValidPassword(new_password);
            return c.json(
                {
                    success: false,
                    message: `Invalid password | ${error}`,
                },
                400,
            );
        }

        const [user] = await getUserSession(c);

        // Return in case of there's no valid logged in user
        if (!user?.id) {
            return c.json(
                {
                    success: false,
                    message: "Unauthenticated request",
                },
                403,
            );
        }

        // Return if the user already has a password
        if (user?.password) {
            return c.json(
                {
                    success: false,
                    message: "Your account already has a password",
                },
                400,
            );
        }

        const hashedPassword = await hashPassword(new_password);
        await prisma.user.update({
            where: {
                id: user.id,
            },
            data: {
                unverified_new_password: hashedPassword,
            },
        });

        await sendNewPasswordVerificationEmail({
            user_id: user.id,
            email: user.email,
            name: user.name,
        });
        return c.json({
            success: true,
            message: "You should receive a confirmation email shortly",
        });
    } catch (error) {
        console.error(error);
        return c.json(
            {
                success: false,
                message: "Internal server error",
            },
            500,
        );
    }
});

// * Returns the type of action the code was generated for
userRouter.post("/verification-code-action-type", async (c) => {
    try {
        const body = await c.req.json();
        const token = body?.token;

        if (!token)
            return c.json({
                type: null,
            });

        const verificationAction = await prisma.verificationRequest.findUnique({
            where: {
                token: token,
            },
            select: {
                action: true,
                date_created: true,
                user: {
                    select: {
                        email: true,
                    },
                },
            },
        });

        // Check if the token is expired
        if (
            verificationAction?.date_created &&
            !isVerificationTokenValid(verificationAction?.date_created, addNewPasswordVerificationTokenValidity)
        ) {
            await prisma.verificationRequest.delete({
                where: {
                    token: token,
                },
            });

            return c.json({ type: null });
        }

        return c.json({ type: verificationAction?.action || null, email: verificationAction.user.email });
    } catch (error) {
        console.error(error);
        return c.json({ type: null });
    }
});

// * Removes current account password
userRouter.post("/remove-account-password", async (c) => {
    try {
        const data = await c.req.json();
        const entered_password = data?.entered_password;

        if (!password) {
            return c.json(
                {
                    success: false,
                    message: "Invalid password",
                },
                400,
            );
        }

        const [user] = await getUserSession(c);

        // Return in case of there's no valid logged in user
        if (!user?.id) {
            return c.json(
                {
                    success: false,
                    message: "Unauthenticated request",
                },
                403,
            );
        }

        // Return if the user doesn't have a password
        if (!user?.password) {
            return c.json(
                {
                    success: false,
                    message: "Your account does not have a password",
                },
                400,
            );
        }

        // Match if the user entered correct password
        const isCorrectPassword = await matchPassword(entered_password, user.password);
        if (isCorrectPassword !== true) {
            return c.json(
                {
                    success: false,
                    message: "Incorrect password",
                },
                400,
            );
        }

        await prisma.user.update({
            where: {
                id: user.id,
            },
            data: {
                password: null,
                unverified_new_password: null,
            },
        });

        return c.json({
            success: true,
            message: "Removed account password",
        });
    } catch (error) {
        console.error(error);
        return c.json(
            {
                success: false,
                message: "Internal server error",
            },
            500,
        );
    }
});

// * Confirm to add the new password
userRouter.post("/confirm-new-password", async (c) => {
    try {
        const body = await c.req.json();
        const token = body?.token;

        if (!token) {
            return c.json(
                {
                    success: false,
                    message: "Missing confirmation token",
                },
                400,
            );
        }

        const verificationRequestData: {
            token?: string;
            user_id?: string;
            date_created?: Date;
            password?: string;
            unverified_new_password?: string;
        } = {};

        try {
            const data = await prisma.verificationRequest.delete({
                where: {
                    token: token,
                    action: UserVerificationActionTypes.ADD_PASSWORD,
                },
                select: {
                    token: true,
                    date_created: true,
                    user_id: true,
                    user: {
                        select: {
                            password: true,
                            unverified_new_password: true,
                        },
                    },
                },
            });

            verificationRequestData.user_id = data.user_id;
            verificationRequestData.token = data.token;
            verificationRequestData.date_created = data.date_created;
            verificationRequestData.password = data.user.password;
            verificationRequestData.unverified_new_password = data.user.unverified_new_password;
        } catch (error) {
            return c.json(
                {
                    success: false,
                    message: "Invalid token",
                },
                400,
            );
        }

        if (!verificationRequestData?.token) {
            return c.json(
                {
                    success: false,
                    message: "Invalid token",
                },
                400,
            );
        }

        if (!isVerificationTokenValid(verificationRequestData?.date_created, addNewPasswordVerificationTokenValidity)) {
            return c.json(
                {
                    success: false,
                    message: "Expired token",
                },
                400,
            );
        }

        if (verificationRequestData?.password) {
            return c.json(
                {
                    success: false,
                    message: "You have already added a password.",
                },
                400,
            );
        }

        await prisma.user.update({
            where: {
                id: verificationRequestData.user_id,
            },
            data: {
                password: verificationRequestData.unverified_new_password,
                unverified_new_password: null,
            },
        });

        return c.json({
            success: true,
            message: "Successfullly added new password",
        });
    } catch (error) {
        console.error(error);
        return c.json(
            {
                success: false,
                message: "Internal server error",
            },
            500,
        );
    }
});

// * Discard the add new password request
userRouter.post("/discard-new-password", async (c) => {
    try {
        const body = await c.req.json();
        const token = body?.token;

        if (!token) {
            return c.json(
                {
                    success: false,
                    message: "Missing confirmation token",
                },
                400,
            );
        }

        let res: VerificationRequest;

        try {
            res = await prisma.verificationRequest.delete({
                where: {
                    token: token,
                    action: UserVerificationActionTypes.ADD_PASSWORD,
                },
            });
        } catch (error) {
            return c.json(
                {
                    success: false,
                    message: "Invalid request",
                },
                400,
            );
        }

        if (!res?.token) {
            return c.json(
                {
                    success: false,
                    message: "Invalid request",
                },
                400,
            );
        }

        return c.json({
            success: true,
            message: "Discarded the new password",
        });
    } catch (error) {
        console.error(error);
        return c.json(
            {
                success: false,
                message: "Internal server error",
            },
            500,
        );
    }
});

// * Send password change email
userRouter.post("/send-password-change-email", async (c) => {
    try {
        const body = await c.req.json();
        const email = body?.email;

        if (!email) {
            return c.json(
                {
                    success: false,
                    message: "Missing email",
                },
                400,
            );
        }

        const userData = await prisma.user.findUnique({
            where: {
                email: email,
            },
        });

        if (!userData) {
            return c.json({
                success: true,
                message: "You should receive a password change link shortly if you entered the correct email.",
            });
        }

        await sendPasswordChangeEmail(userData);

        return c.json({
            success: true,
            message: "You should receive a password change link shortly if you entered the correct email.",
        });
    } catch (error) {
        console.error(error);

        return c.json(
            {
                success: false,
                message: "Internal server error",
            },
            500,
        );
    }
});

// * Change user's account password
userRouter.post("/change-account-password", async (c) => {
    try {
        const body = await c.req.json();
        const token = body?.token;
        const newPassword = body?.newPassword;

        if (!token) {
            return c.json(
                {
                    success: false,
                    message: "Missing confirmation token",
                },
                400,
            );
        }

        if (isValidPassword(newPassword) !== true) {
            const error = isValidPassword(newPassword);
            return c.json({
                success: false,
                message: error as string,
            });
        }
        let verificationRequestData: VerificationRequest;

        try {
            verificationRequestData = await prisma.verificationRequest.delete({
                where: {
                    token: token,
                    action: UserVerificationActionTypes.CHANGE_PASSWORD,
                },
            });
        } catch (error) {
            return c.json(
                {
                    success: false,
                    message: "Invalid token",
                },
                400,
            );
        }
        if (!verificationRequestData?.token) {
            return c.json(
                {
                    success: false,
                    message: "Invalid token",
                },
                400,
            );
        }

        if (!isVerificationTokenValid(verificationRequestData?.date_created, changePasswordConfirmationTokenValidity)) {
            return c.json(
                {
                    success: false,
                    message: "Expired token",
                },
                400,
            );
        }

        const hashedPassword = await hashPassword(newPassword);
        await prisma.user.update({
            where: {
                id: verificationRequestData.user_id,
            },
            data: {
                password: hashedPassword,
            },
        });

        return c.json({
            success: true,
            message: "Successfully changed account password",
        });
    } catch (error) {
        console.error(error);
        return c.json(
            {
                success: false,
                message: "Internal server error",
            },
            500,
        );
    }
});

// * Discard change password request
userRouter.post("/discard-change-password-request", async (c) => {
    try {
        const body = await c.req.json();
        const token = body?.token;

        if (!token) {
            return c.json(
                {
                    success: false,
                    message: "Missing confirmation token",
                },
                400,
            );
        }

        let res: VerificationRequest;

        try {
            res = await prisma.verificationRequest.delete({
                where: {
                    token: token,
                    action: UserVerificationActionTypes.CHANGE_PASSWORD,
                },
            });
        } catch (error) {
            return c.json(
                {
                    success: false,
                    message: "Invalid token",
                },
                400,
            );
        }

        if (!res?.token) {
            return c.json(
                {
                    success: false,
                    message: "Invalid token",
                },
                400,
            );
        }

        return c.json({
            success: true,
            message: "Discarded password change request",
        });
    } catch (error) {
        console.error(error);
        return c.json(
            {
                success: false,
                message: "Internal server error",
            },
            500,
        );
    }
});

// * Remove auth provider from user account
userRouter.post("/remove-auth-provider", async (c) => {
    try {
        const body = await c.req.json();
        const provider_name = await body?.provider_name;

        if (!provider_name) {
            return c.json(
                {
                    success: false,
                    message: "Invalid request",
                },
                400,
            );
        }

        const [user] = await getUserSession(c);

        if (!user?.id) {
            return c.json(
                {
                    success: false,
                    message: "Invalid request",
                },
                400,
            );
        }

        const existingProviders = await prisma.account.findMany({
            where: {
                user_id: user?.id,
            },
        });

        if (!existingProviders?.length) {
            return c.json(
                {
                    success: false,
                    message: "Invalid request",
                },
                400,
            );
        }

        if (existingProviders.length === 1) {
            return c.json(
                {
                    success: false,
                    message: "You can't unlink the only remaining auth provider",
                },
                400,
            );
        }

        const targetProvider = existingProviders
            .filter((provider) => {
                if (provider.provider === provider_name) {
                    return provider;
                }
            })
            ?.at(0);

        if (!targetProvider) {
            return c.json(
                {
                    success: false,
                    message: "Invalid request",
                },
                400,
            );
        }
        await prisma.account.delete({
            where: {
                id: targetProvider.id,
            },
        });

        return c.json({
            success: true,
            message: `Successfully remove ${provider_name} provider from your account`,
        });
    } catch (error) {
        console.error(error);

        return c.json(
            {
                success: false,
                message: "Internal server error",
            },
            500,
        );
    }
});

// * Returns if a user has set a password in his account or not
userRouter.get("/has-password", async (c) => {
    try {
        const [user] = await getUserSession(c);

        if (!user?.id) {
            return c.json(
                {
                    message: "Unauthenticated request",
                },
                403,
            );
        }

        return c.json({
            hasPassword: !!user?.password?.length,
        });
    } catch (error) {
        console.error(error);
        return c.json({
            hasPassword: false,
        });
    }
});

// * Send account deletion link to user's email
userRouter.post("/send-account-deletion-email", async (c) => {
    try {
        const [user] = await getUserSession(c);

        if (!user?.id) {
            return c.json(
                {
                    success: false,
                    message: "Unauthenticated request",
                },
                403,
            );
        }

        sendAccountDeletionConfirmationEmail(user);

        return c.json({
            success: true,
            message: "You should receive a confirmation email shortly",
        });
    } catch (error) {
        console.error(error);
        return c.json(
            {
                success: false,
                message: "Internal server error",
            },
            500,
        );
    }
});

// * Confirm user account deletion
userRouter.post("/confirm-user-account-deletion", async (c) => {
    try {
        const body = await c.req.json();
        const token = body?.token;

        if (!token) {
            return c.json(
                {
                    success: false,
                    message: "Missing confirmation token",
                },
                400,
            );
        }

        const [user] = await getUserSession(c);

        if (!user?.id) {
            return c.json(
                {
                    success: false,
                    message: "Unauthenticated user",
                },
                403,
            );
        }
        let verificationActionData: VerificationRequest;

        try {
            verificationActionData = await prisma.verificationRequest.delete({
                where: {
                    token: token,
                    action: UserVerificationActionTypes.DELETE_USER_ACCOUNT,
                },
            });
        } catch (error) {
            return c.json(
                {
                    success: false,
                    message: "Invalid token",
                },
                400,
            );
        }

        if (!verificationActionData?.token) {
            return c.json(
                {
                    success: false,
                    message: "Invalid token",
                },
                400,
            );
        }

        if (!isVerificationTokenValid(verificationActionData?.date_created, deleteAccountVerificationTokenValidity)) {
            return c.json(
                {
                    success: false,
                    message: "Expired token",
                },
                400,
            );
        }

        const userData = await prisma.user.delete({
            where: {
                id: user?.id,
            },
        });

        await deleteAllUserFiles(user.id).catch((e) => console.error(e));

        await prisma.deletedUser.create({
            data: {
                user_name: userData.user_name,
                email: userData.email,
                deletion_time: new Date(),
            },
        });

        return c.json({
            success: true,
            message:
                "Successfully deleted your account and all the related data.",
        });
    } catch (error) {
        console.error(error);

        return c.json(
            {
                success: false,
                message: "Internal server error",
            },
            500,
        );
    }
});

// * Discard account deletion request
userRouter.post("/discard-user-account-deletion", async (c) => {
    try {
        const body = await c.req.json();
        const token = body?.token;

        if (!token) {
            return c.json(
                {
                    success: false,
                    message: "Missing confirmation token",
                },
                400,
            );
        }
        let res: VerificationRequest;

        try {
            res = await prisma.verificationRequest.delete({
                where: {
                    token: token,
                    action: UserVerificationActionTypes.DELETE_USER_ACCOUNT,
                },
            });
        } catch (error) {
            return c.json(
                {
                    success: false,
                    message: "Invalid token",
                },
                400,
            );
        }

        if (!res?.token) {
            return c.json(
                {
                    success: false,
                    message: "Invalid token",
                },
                400,
            );
        }

        return c.json({
            success: true,
            message: "Discarded account deletion request",
        });
    } catch (error) {
        console.error(error);

        return c.json(
            {
                success: false,
                message: "Internal server error",
            },
            500,
        );
    }
});

export default userRouter;
