import { type CategoryType, categories } from "../../config/project";
import type { TeamMember } from "../../types/api";

export const lowerCaseAlphabets = "abcdefghijklmnopqrstuvwxyz";
export const upperCaseAlphabets = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
export const digits = "0123456789";

export const Capitalize = (str: string, eachWord = false) => {
    if (eachWord === false) {
        return `${str[0].toUpperCase()}${str.slice(1)}`;
    }

    let newStr = "";
    for (const word of str.split(" ")) {
        newStr += `${word[0].toUpperCase()}${word.length > 1 ? word.slice(1) : ""} `;
    }

    return newStr;
};

export function CapitalizeAndFormatString(str: string | null | undefined) {
    if (!str) return str;

    return Capitalize(str.toLowerCase()).replaceAll("_", " ").replaceAll("-", " ");
}

export function createURLSafeSlug(slug: string, additionalAllowedChars?: string) {
    const allowedURLCharacters = `${lowerCaseAlphabets}${upperCaseAlphabets}${digits}\`!@$()-_.,"${additionalAllowedChars || ""}`;

    const result = {
        validInput: false,
        value: "",
    };

    for (const char of slug.replaceAll(" ", "-").toLowerCase()) {
        if (allowedURLCharacters.includes(char)) {
            result.value += char;
        }
    }

    return result;
}

export function formatUserName(str: string, additionalChars?: string) {
    const allowedCharacters = `${lowerCaseAlphabets}${upperCaseAlphabets}${digits}-_${additionalChars || ""}`;

    let formattedString = "";
    for (const char of str) {
        if (allowedCharacters.includes(char)) formattedString += char;
    }

    return formattedString;
}

export function isValidUrl(url: string) {
    const regex =
        /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/;
    return !!regex.exec(url);
}

export const isUserAProjectMember = (userId?: string, membersList?: Partial<TeamMember>[]) => {
    try {
        if (!userId || !membersList?.length) return false;

        for (const member of membersList) {
            if (member.userId === userId) return member;
        }
        return false;
    } catch {
        return false;
    }
};

const fileSizeSuffixes = {
    bytes: "Bytes",
    kib: "KiB",
    mib: "MiB",
    gib: "GiB",
};

export function parseFileSize(size: number): string {
    if (!size) {
        return `0 ${fileSizeSuffixes.bytes}`;
    }
    if (size >= 0 && size < 1024) {
        return `${size} ${fileSizeSuffixes.bytes}`;
    }
    if (size >= 1024 && size < 1024_000) {
        return `${(size / 1024).toFixed(1)} ${fileSizeSuffixes.kib}`;
    }
    if (size >= 1024_000 && size < 1048576000) {
        return `${(size / (1024 * 1024)).toFixed(2)} ${fileSizeSuffixes.mib}`;
    }
    return `${(size / (1024 * 1024 * 1024)).toFixed(3)} ${fileSizeSuffixes.gib}`;
}

export const getValidProjectCategories = (projectTypes: string[]) => {
    const alreadyAddedCategories = new Set<string>();
    const validCategories: CategoryType[] = [];

    // Loop over all categories and check if the project type is in the category's project types
    for (const category of categories) {
        for (const type of category.projectTypes) {
            if (projectTypes.includes(type) && !alreadyAddedCategories.has(category.name)) {
                alreadyAddedCategories.add(category.name);
                validCategories.push(category);
                break;
            }
        }
    }

    return validCategories;
};

export const getProjectCategoryDataFromName = (categoryName: string) => {
    for (const category of categories) {
        if (category.name === categoryName.toLowerCase()) return category;
    }

    return null;
};

export const getProjectCategoriesDataFromNames = (categoryNames: string[]) => {
    const uniqueCategoryNames = Array.from(new Set(categoryNames));
    const categoriesData = [];

    for (const name of uniqueCategoryNames) {
        const category = getProjectCategoryDataFromName(name);
        if (category) categoriesData.push(category);
    }

    return categoriesData;
};
