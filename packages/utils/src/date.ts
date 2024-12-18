export const monthNames = [
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

export const shortMonthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const defaultPhrases = {
    justNow: "just now",
    minuteAgo: (mins: number) => {
        switch (mins) {
            case 1:
                return "a minute ago";
            default:
                return `${mins} minutes ago`;
        }
    },
    hourAgo: (hours: number) => {
        switch (hours) {
            case 1:
                return "an hour ago";
            default:
                return `${hours} hours ago`;
        }
    },
    dayAgo: (days: number) => {
        switch (days) {
            case 1:
                return "yesterday";
            default:
                return `${days} days ago`;
        }
    },
    weekAgo: (weeks: number) => {
        switch (weeks) {
            case 1:
                return "last week";
            default:
                return `${weeks} weeks ago`;
        }
    },
    monthAgo: (months: number) => {
        switch (months) {
            case 1:
                return "last month";
            default:
                return `${months} months ago`;
        }
    },
    yearAgo: (years: number) => {
        switch (years) {
            case 1:
                return "last year";
            default:
                return `${years} years ago`;
        }
    },
};

export function timeSince(pastTime: Date, t = defaultPhrases): string {
    try {
        const now = new Date();
        const diff = now.getTime() - pastTime.getTime();

        const seconds = Math.abs(diff / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.round(hours / 24);
        const weeks = Math.round(days / 7);
        const months = Math.round(days / 30.4375);
        const years = Math.round(days / 365.25);

        if (seconds < 60) {
            return t.justNow;
        }
        if (minutes < 60) {
            return t.minuteAgo(minutes);
        }
        if (hours < 24) {
            return t.hourAgo(hours);
        }
        if (days < 7) {
            return t.dayAgo(days);
        }
        if (weeks < 4) {
            return t.weekAgo(weeks);
        }
        if (months < 12) {
            return t.monthAgo(months);
        }
        return t.yearAgo(years);
    } catch (error) {
        console.error(error);
        return "";
    }
}

export function formatDate(
    date: Date,
    timestamp_template = "${month} ${day}, ${year} at ${hours}:${minutes} ${amPm}",
    useShortMonthNames = false,
    utc = false,
): string {
    try {
        const year = utc ? date.getUTCFullYear() : date.getFullYear();
        const monthIndex = utc ? date.getUTCMonth() : date.getMonth();
        const month = (useShortMonthNames ? shortMonthNames : monthNames)[monthIndex];
        const day = utc ? date.getUTCDate() : date.getDate();

        const hours = utc ? date.getUTCHours() : date.getHours();
        const minutes = utc ? date.getUTCMinutes() : date.getMinutes();
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
        console.error(error);
        return "";
    }
}

export function DateFromStr(date: string | Date) {
    try {
        return new Date(date);
    } catch (error) {
        return null;
    }
}

export function DateToISOStr(date: string | Date) {
    try {
        return new Date(date).toISOString();
    } catch (error) {
        return null;
    }
}
