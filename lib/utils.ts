import { Categories, CategoryType, Loaders, ProjectTypes, ProjectVisibilityOptions, ReleaseChannelsList } from "@root/config/project";
import { ProjectVisibility, ReleaseChannels, TypeTimePastPhrases } from "@root/types";

export const timeSince = (pastTime: Date, timePastPhrases: TypeTimePastPhrases): string => {
    try {
        const now = new Date();
        const diff = now.getTime() - pastTime.getTime();
        const seconds = Math.abs(diff / 1000);
        const minutes = Math.round(seconds / 60);
        const hours = Math.round(minutes / 60);
        const days = Math.round(hours / 24);
        const weeks = Math.round(days / 7);
        const months = Math.round(days / 30.4375);
        const years = Math.round(days / 365.25);

        if (seconds < 60) {
            return timePastPhrases.just_now;
        }
        if (minutes < 60) {
            return minutes === 1
                ? timePastPhrases.minute_ago
                : timePastPhrases.minutes_ago.replace("${0}", `${minutes}`);
        }
        if (hours < 24) {
            return hours === 1
                ? timePastPhrases.hour_ago
                : timePastPhrases.hours_ago.replace("${0}", `${hours}`);
        }
        if (days < 7) {
            return days === 1
                ? timePastPhrases.day_ago
                : timePastPhrases.days_ago.replace("${0}", `${days}`);
        }
        if (weeks < 4) {
            return weeks === 1
                ? timePastPhrases.week_ago
                : timePastPhrases.weeks_ago.replace("${0}", `${weeks}`);
        }
        if (months < 12) {
            return months === 1
                ? timePastPhrases.month_ago
                : timePastPhrases.months_ago.replace("${0}", `${months}`);
        }
        return years === 1
            ? timePastPhrases.year_ago
            : timePastPhrases.years_ago.replace("${0}", `${years}`);
    } catch (error) {
        console.error(error)
        return "";
    }
};

export const formatDate = (
    date: Date,
    timestamp_template: string,
    local_year?: number,
    local_monthIndex?: number,
    local_day?: number,
    local_hours?: number,
    local_minutes?: number,
): string => {
    try {
        const monthNames = [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December",
        ];

        const year = local_year || date.getFullYear();
        const monthIndex = local_monthIndex || date.getMonth();
        const month = monthNames[monthIndex];
        const day = local_day || date.getDate();

        const hours = local_hours || date.getHours();
        const minutes = local_minutes || date.getMinutes();
        const amPm = hours >= 12 ? "PM" : "AM";
        const adjustedHours = hours % 12 || 12; // Convert to 12-hour format

        const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes.toString();

        return timestamp_template
            .replace("${month}", `${month}`)
            .replace("${day}", `${day}`)
            .replace("${year}", `${year}`)
            .replace("${hours}", `${adjustedHours}`)
            .replace("${minutes}", `${formattedMinutes}`)
            .replace("${amPm}", `${amPm}`);
    } catch (error) {
        console.error(error)
        return "";
    }
};

export function createURLSafeSlug(slug: string) {
    const allowedURLCharacters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890`!@$()-_.,"';

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

const fileSizeSuffixes = {
    bytes: "bytes",
    kib: "KiB",
    mib: "MiB",
    gib: "GiB"
}

export function parseFileSize(size: number): string {
    if (!size) {
        return `0 ${fileSizeSuffixes.bytes}`
    }
    else if (size >= 0 && size < 1024) {
        return `${size} ${fileSizeSuffixes.bytes}`
    }
    else if (size >= 1024 && size < 1024_000) {
        return `${(size / 1024).toFixed(1)} ${fileSizeSuffixes.kib}`
    }
    else if (size >= 1024_000 && size < 1048576000) {
        return `${(size / (1024 * 1024)).toFixed(2)} ${fileSizeSuffixes.mib}`
    }
    else {
        return `${(size / (1024 * 1024 * 1024)).toFixed(3)} ${fileSizeSuffixes.gib}`
    }
}

export function CapitalizeAndFormatString(str: string | null | undefined) {
    if (!str) return str;

    return `${str[0].toUpperCase()}${str.slice(1).toLowerCase()}`.replaceAll("_", " ");
}

export function isValidUrl(url: string) {
    const regex = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/;
    return !!regex.exec(url);
}

export function isValidString(str: string | undefined | null, maxLength: number, minLength = 1, noTrailingSpaces = true) {
    const value = (noTrailingSpaces ? str?.trim() : str) || "";
    if (value.length > minLength && value.length <= maxLength) {
        return {
            isValid: true,
            value: value
        }
    }

    return {
        isValid: false,
        value: value
    }
};

export const shuffleCharacters = (str: string) => {
    const characters = str.split("");
    for (let i = characters.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [characters[i], characters[j]] = [characters[j], characters[i]];
    }
    return characters.join("");
};

export const generateRandomCode = (length = 32) => {
    let result = shuffleCharacters(crypto.randomUUID().replaceAll("-", ""));
    while (result.length < length) {
        result += shuffleCharacters(crypto.randomUUID().replaceAll("-", ""));
    }

    return shuffleCharacters(result.slice(0, length));
};

export const Capitalize = (str: string) => {
    if (!str) return str;
    return `${str[0].toUpperCase()}${str.slice(1)}`;
};

export const GetProjectVisibility = (visibility: string) => {
    for (const validVisibilityOption of ProjectVisibilityOptions) {
        if (validVisibilityOption === visibility) {
            return validVisibilityOption;
        }
    }

    return ProjectVisibility.PUBLIC;
};

export const GetProjectType = (project_type: string) => {
    for (const validProjectType of ProjectTypes) {
        if (validProjectType === project_type) {
            return validProjectType
        }
    }

    return "PROJECT";
};

export const GetUsersProjectMembership = (
    currUserId: string | undefined | null,
    membersIdList: string[],
): boolean | null => {
    if (!currUserId) return null;

    for (const memberId of membersIdList) {
        if (memberId && memberId === currUserId) {
            return true;
        }
    }

    return null;
};

export const GetProjectVersionReleaseChannel = (releaseChannel: string) => {

    for (const validReleaseChannel of ReleaseChannelsList) {
        if (releaseChannel === validReleaseChannel) {
            return validReleaseChannel;
        }
    }

    return ReleaseChannels.RELEASE;
};

export const GetProjectLoader = (loader: string) => {
    for (const validLoader of Loaders) {
        if (validLoader.name === loader) {
            return validLoader.name;
        }
    }

    return null;
};

export const GetProjectLoadersList = (loaders_list: string[]) => {
    const list: (string | null)[] = [];
    for (const loader of loaders_list) {
        const loaderName = GetProjectLoader(loader);
        if (loaderName && !list.includes(loaderName)) {
            list.push(loaderName);
        }
    }

    return list;
};

// export const GetSupportedGameVersions = (list: string[]) => {

// }
export const GetValidProjectCategories = (projectTypes: string[]) => {
    const validCategories: CategoryType[] = [];

    for (const category of Categories) {
        if (projectTypes.includes(category.project_type)) {
            validCategories.push(category);
        }
    }

    return validCategories;
}

export const VerifySelectedCategories = (selectedCategories: string[], projectTypes: string[]) => {
    const allSelectedCategories = new Set(selectedCategories);
    const allValidCategories = GetValidProjectCategories(projectTypes);
    const verifiedCategories: string[] = [];

    for (const validCategory of allValidCategories) {
        if (allSelectedCategories.has(validCategory.name)) {
            verifiedCategories.push(validCategory.name);
        }
    }

    return verifiedCategories;
}

export const GetProjectTagsFromNames = (tagNames: string[], projectTypes: string[]) => {
    const tagsList = new Set<CategoryType>();

    for (const category of Categories) {
        if (tagNames.includes(category.name) && projectTypes.includes(category.project_type)) tagsList.add(category);
    }

    return tagsList;
}