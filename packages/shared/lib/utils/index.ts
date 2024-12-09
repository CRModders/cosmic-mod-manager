import { type CategoryType, type Loader, categories, loaders } from "../../config/project";
import { getRolePerms } from "../../config/roles";
import { GlobalUserRole, type OrganisationPermission, type ProjectPermission, ProjectType, type TagHeaderType } from "../../types";
import type { TeamMember } from "../../types/api";
import { type PartialTeamMember, combineProjectMembers } from "./project";

export const lowerCaseAlphabets = "abcdefghijklmnopqrstuvwxyz";
export const upperCaseAlphabets = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
export const digits = "0123456789";

export const trimWhitespaces = (str: string) => {
    return str.replace(/\s/g, "");
};

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

export function CapitalizeAndFormatString<T extends string | null | undefined>(str: T): T {
    if (!str) return str;

    return Capitalize(str.toLowerCase()).replaceAll("_", " ").replaceAll("-", " ") as T;
}

export function createURLSafeSlug(slug: string, additionalAllowedChars?: string) {
    const allowedURLCharacters = `${lowerCaseAlphabets}${upperCaseAlphabets}${digits}\`!@$()-+_.,"${additionalAllowedChars || ""}`;

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
        /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[+~%\/.\w-_]*)?\??(?:[-+=&;%@.\w_]*)#?(?:[\w]*))?)/;
    return !!regex.exec(url);
}

export function isUserAProjectMember(userId?: string, membersList?: TeamMember[]) {
    try {
        if (!userId || !membersList?.length) return false;

        for (const member of membersList) {
            if (member.userId === userId) return member;
        }
        return false;
    } catch {
        return false;
    }
}

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

export const getValidProjectCategories = (projectTypes: string[], categoryType?: TagHeaderType) => {
    const alreadyAddedCategories = new Set<string>();
    const validCategories: CategoryType[] = [];

    // Loop over all categories and check if the project type is in the category's project types
    for (const category of categories) {
        if (categoryType && categoryType !== category.header) continue;

        if (projectTypes.length > 0) {
            for (const type of category.projectTypes) {
                if (projectTypes.includes(type) && !alreadyAddedCategories.has(category.name)) {
                    alreadyAddedCategories.add(category.name);
                    validCategories.push(category);
                    break;
                }
            }
        } else if (!alreadyAddedCategories.has(category.name)) {
            alreadyAddedCategories.add(category.name);
            validCategories.push(category);
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

export const getAllLoaderCategories = (projectType?: ProjectType, checkTagVisibility = true) => {
    const allLoadersList = new Set<Loader>();

    for (const loader of loaders) {
        if (
            (!projectType || loader.supportedProjectTypes.includes(projectType)) &&
            (!checkTagVisibility || loader.metadata.visibleInTagsList !== false)
        ) {
            allLoadersList.add(loader);
        }
    }

    return Array.from(allLoadersList);
};

export const getALlLoaderFilters = (projectType: ProjectType[]) => {
    if (!projectType?.length) return [];

    const list = new Set<Loader>();
    for (const loader of loaders) {
        if (loader.metadata.isAFilter !== true) continue;

        for (const supportedType of loader.supportedProjectTypes) {
            if (projectType.includes(supportedType)) {
                list.add(loader);
                break;
            }
        }
    }

    return Array.from(list);
};

export const getLoadersByProjectType = (projectType: ProjectType[]) => {
    const loadersList = new Set<Loader>();

    for (const loader of loaders) {
        for (const type of projectType) {
            if (loader.supportedProjectTypes.includes(type)) {
                loadersList.add(loader);
                break;
            }
        }
    }

    return Array.from(loadersList);
};

export const isNumber = (num: number | string) => {
    if (typeof num === "number") {
        return num - num === 0;
    }
    return Number.isFinite(+num);
};

export const doesMemberHaveAccess = (
    requiredPermission: ProjectPermission,
    permissions: ProjectPermission[] = [],
    isOwner = false,
    userRole = GlobalUserRole.USER,
) => {
    if (!requiredPermission) return false;
    if (isOwner === true) return true;
    if (getRolePerms(userRole).PROJECT.includes(requiredPermission)) return true;
    return permissions.includes(requiredPermission);
};

export const doesOrgMemberHaveAccess = (
    requiredPermission: OrganisationPermission,
    permissions: OrganisationPermission[] = [],
    isOwner = false,
    userRole = GlobalUserRole.USER,
) => {
    if (!requiredPermission) return false;
    if (isOwner === true) return true;
    if (getRolePerms(userRole).ORGANIZATION.includes(requiredPermission)) return true;
    return permissions.includes(requiredPermission);
};

export const getCurrMember = <T extends PartialTeamMember>(userId: string | null | undefined, teamMembers: T[], orgMembers: T[]) => {
    if (!userId) return null;
    const combinedMembers = combineProjectMembers(teamMembers, orgMembers);
    return combinedMembers.get(userId);
};

export const isUrl = (str: string) => {
    try {
        new URL(str);

        return true;
    } catch (error) {
        return false;
    }
};

export const compatibleProjectTypes = {
    [ProjectType.MODPACK]: [],
    [ProjectType.SHADER]: [ProjectType.RESOURCE_PACK],
    [ProjectType.RESOURCE_PACK]: [ProjectType.SHADER],
    [ProjectType.DATAMOD]: [ProjectType.MOD],
    [ProjectType.MOD]: [ProjectType.DATAMOD, ProjectType.PLUGIN],
    [ProjectType.PLUGIN]: [ProjectType.MOD],
};

export const filterInCompatibleProjectTypes = (primaryType: ProjectType, currTypes: ProjectType[]) => {
    const filteredTypes = [primaryType];
    const compatibleTypes: ProjectType[] = compatibleProjectTypes[primaryType];

    for (const type of currTypes) {
        if (compatibleTypes.includes(type)) {
            filteredTypes.push(type);
        }
    }

    return filteredTypes;
};

export const validateProjectTypesCompatibility = (types: ProjectType[]) => {
    if (types.length < 2) return types;

    if (types.includes(ProjectType.MODPACK)) return filterInCompatibleProjectTypes(ProjectType.MODPACK, types);
    if (types.includes(ProjectType.SHADER)) return filterInCompatibleProjectTypes(ProjectType.SHADER, types);
    if (types.includes(ProjectType.RESOURCE_PACK)) return filterInCompatibleProjectTypes(ProjectType.RESOURCE_PACK, types);
    if (types.includes(ProjectType.DATAMOD)) return filterInCompatibleProjectTypes(ProjectType.DATAMOD, types);
    if (types.includes(ProjectType.MOD)) return filterInCompatibleProjectTypes(ProjectType.MOD, types);
    if (types.includes(ProjectType.PLUGIN)) return filterInCompatibleProjectTypes(ProjectType.PLUGIN, types);

    return ["project"];
};
