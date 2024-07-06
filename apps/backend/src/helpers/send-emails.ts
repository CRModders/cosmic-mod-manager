import {
    AccountDeletionVerificationEmailTemplate,
    ChangePasswordVerificationEmailTemplate,
    NewPasswordConfirmationEmailTemplate,
    NewSignInAlertEmailTemplate,
} from "@/lib/email-templates";
import { sendEmail } from "@/lib/nodemailer";
import prisma from "@/lib/prisma";
import { type User } from "@prisma/client";
import {
    addNewPasswordVerificationTokenValidity,
    changePasswordConfirmationTokenValidity,
    deleteAccountVerificationTokenValidity,
} from "@root/config";
import { generateRandomCode, monthNames } from "@root/lib/utils";
import { UserVerificationActionTypes } from "@root/types";

const baseUrl = process.env.BASE_URL;

export const sendNewPasswordVerificationEmail = async ({
    user_id,
    email,
    name,
}: { user_id: string; email: string; name: string }) => {
    try {
        try {
            await prisma.verificationRequest.deleteMany({
                where: {
                    user_id: user_id,
                    action: UserVerificationActionTypes.ADD_PASSWORD,
                },
            });
        } catch (error) {}

        const res = await prisma.verificationRequest.create({
            data: {
                user_id: user_id,
                action: UserVerificationActionTypes.ADD_PASSWORD,
                token: `${user_id}${generateRandomCode()}`,
            },
        });

        const token = res.token;

        const emailTemplate = NewPasswordConfirmationEmailTemplate({
            name: name,
            confirmationPageUrl: `${baseUrl}/verify-action?token=${encodeURIComponent(token)}`,
            siteUrl: baseUrl,
            expiryDuration: addNewPasswordVerificationTokenValidity,
        });

        await sendEmail({
            receiver: email,
            subject: emailTemplate.subject,
            text: emailTemplate.text,
            template: emailTemplate.EmailHTML,
        });

        return { success: true, message: "Email sent successfully" };
    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: "Error while sending email",
        };
    }
};

export const sendPasswordChangeEmail = async (user: Partial<User>) => {
    try {
        try {
            await prisma.verificationRequest.deleteMany({
                where: {
                    user_id: user.id,
                    action: UserVerificationActionTypes.CHANGE_PASSWORD,
                },
            });
        } catch (error) {}

        const res = await prisma.verificationRequest.create({
            data: {
                user_id: user.id,
                action: UserVerificationActionTypes.CHANGE_PASSWORD,
                token: `${user.id}${generateRandomCode()}`,
            },
        });

        const token = res.token;

        const emailTemplate = ChangePasswordVerificationEmailTemplate({
            name: user.name,
            confirmationPageUrl: `${baseUrl}/verify-action?token=${encodeURIComponent(token)}`,
            siteUrl: baseUrl,
            expiryDuration: changePasswordConfirmationTokenValidity,
        });

        await sendEmail({
            receiver: user.email,
            subject: emailTemplate.subject,
            text: emailTemplate.text,
            template: emailTemplate.EmailHTML,
        });

        return { success: true, message: "Email sent successfully" };
    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: "Error while sending email",
        };
    }
};

export const sendAccountDeletionConfirmationEmail = async (user: Partial<User>) => {
    try {
        try {
            await prisma.verificationRequest.deleteMany({
                where: {
                    user_id: user.id,
                    action: UserVerificationActionTypes.DELETE_USER_ACCOUNT,
                },
            });
        } catch (error) {}

        const res = await prisma.verificationRequest.create({
            data: {
                user_id: user.id,
                action: UserVerificationActionTypes.DELETE_USER_ACCOUNT,
                token: `${user.id}${generateRandomCode()}`,
            },
        });

        const token = res.token;

        const emailTemplate = AccountDeletionVerificationEmailTemplate({
            name: user.name,
            confirmationPageUrl: `${baseUrl}/verify-action?token=${encodeURIComponent(token)}`,
            siteUrl: baseUrl,
            expiryDuration: deleteAccountVerificationTokenValidity,
        });

        await sendEmail({
            receiver: user.email,
            subject: emailTemplate.subject,
            text: emailTemplate.text,
            template: emailTemplate.EmailHTML,
        });

        return { success: true, message: "Email sent successfully" };
    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: "Error while sending email",
        };
    }
};

export const SendNewSigninAlertEmail = async ({
    name,
    receiver_email,
    region,
    country,
    ip,
    browserName,
    osName,
    auth_provider,
}: {
    name: string;
    receiver_email: string;
    region: string;
    country: string;
    ip: string;
    browserName: string;
    osName: string;
    auth_provider: string;
}) => {
    try {
        const currTime = new Date();

        const emailTemplate = NewSignInAlertEmailTemplate({
            name: name,
            sessions_page_url: `${baseUrl}/settings/sessions`,
            site_url: baseUrl,
            os_name: osName,
            browser_name: browserName,
            ip_address: ip,
            auth_provider: auth_provider,
            location: `${region} - ${country}`,
            formatted_timestamp: `${monthNames[currTime.getUTCMonth()]} ${currTime.getUTCDate()}, ${currTime.getUTCFullYear()} at ${currTime.getUTCHours()}:${currTime.getUTCMinutes()}  (UTC Time 24 hr format)`,
        });

        await sendEmail({
            receiver: receiver_email,
            subject: emailTemplate.subject,
            text: emailTemplate.text,
            template: emailTemplate.EmailHTML,
        });

        return { success: true, message: "Email sent successfully" };
    } catch (err) {
        console.error(err);
        return {
            success: false,
            message: "Error while sending email",
        };
    }
};
