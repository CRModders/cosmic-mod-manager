import { z } from "zod";
import {
    MAX_EMAIL_LENGTH,
    MAX_NAME_LENGTH,
    MAX_PASSWORD_LENGTH,
    MAX_USERNAME_LENGTH,
    MIN_EMAIL_LENGTH,
    MIN_NAME_LENGTH,
    MIN_PASSWORD_LENGTH,
    MIN_USERNAME_LENGTH,
} from "../../config/forms";
import { AuthProviders } from "../../types";

export const profileUpdateFormSchema = z.object({
    avatarUrlProvider: z.nativeEnum(AuthProviders),
    userName: z
        .string()
        .min(MIN_USERNAME_LENGTH, "Enter your username")
        .max(MAX_USERNAME_LENGTH, `Your username can only have a maximum of ${MAX_USERNAME_LENGTH} characters`),
    name: z
        .string()
        .min(MIN_NAME_LENGTH, "Enter your full name")
        .max(MAX_NAME_LENGTH, `Your name can only have a maximum of ${MAX_NAME_LENGTH} characters`),
});

export const setNewPasswordFormSchema = z.object({
    newPassword: z
        .string()
        .min(MIN_PASSWORD_LENGTH, `Your password must be atleast ${MIN_PASSWORD_LENGTH} characters`)
        .max(MAX_PASSWORD_LENGTH, `Your password can only have a maximum of ${MAX_PASSWORD_LENGTH} characters`),

    confirmNewPassword: z
        .string()
        .min(MIN_PASSWORD_LENGTH, `Your password must be atleast ${MIN_PASSWORD_LENGTH} characters`)
        .max(MAX_PASSWORD_LENGTH, `Your password can only have a maximum of ${MAX_PASSWORD_LENGTH} characters`),
});

export const removeAccountPasswordFormSchema = z.object({
    password: z.string().min(MIN_PASSWORD_LENGTH).max(MAX_PASSWORD_LENGTH),
});

export const sendAccoutPasswordChangeLinkFormSchema = z.object({
    email: z.string().min(MIN_EMAIL_LENGTH).max(MAX_EMAIL_LENGTH),
});
