import { maxNameLength, maxUsernameLength, minPasswordLength } from "@root/config";
import { AuthProvidersEnum } from "@root/types";

export const isValidUsername = (username: string): string | boolean => {
    const usernameRegex = /^[a-zA-Z0-9_]+$/;

    if (username.includes(" ")) {
        return "Username cannot contain spaces";
    }

    if (!usernameRegex.test(username)) {
        return "No special character other than underscore( _ ) is allowed";
    }

    if (username.length > maxUsernameLength) {
        return `Your username can only have a maximum of ${maxUsernameLength} character`;
    }

    return true;
};

export const isValidName = (username: string): string | boolean => {
    const nameRegex = /^[a-zA-Z0-9_ -]+$/;

    if (!nameRegex.test(username.replaceAll(" ", ""))) {
        return "Your name cannot contain special characters";
    }

    if (username.length > maxUsernameLength) {
        return `Your name can only have a maximum of ${maxNameLength} character`;
    }

    return true;
};

export const isValidPassword = (password: string): boolean | string => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);

    if (!hasUpperCase && !hasLowerCase) {
        return "Your password must contain an alphabetical character";
    }

    if (!hasNumber) {
        return "Your password must contain a number";
    }

    if (password.length < minLength) {
        return `Your password must be ${minPasswordLength} characters long`;
    }

    return true;
};

export const isValidEmail = (email: string): boolean => {
    const emailRegex =
        /^(?=.{1,256}$)[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:(?=[a-zA-Z0-9-]{1,63}\.)(?!-)[a-zA-Z0-9-]{1,63}(?<!-)\.?)+(?:[a-zA-Z]{2,})$/;
    return emailRegex.test(email);
};

export const parseProfileProvider = (provider: string): AuthProvidersEnum | null => {
    if (provider === "google") return AuthProvidersEnum.GOOGLE;
    if (provider === "discord") return AuthProvidersEnum.DISCORD;
    if (provider === "github") return AuthProvidersEnum.GITHUB;
    if (provider === "gitlab") return AuthProvidersEnum.GITLAB;
    return null;
};
