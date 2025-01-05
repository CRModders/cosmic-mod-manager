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

export function DateFromStr(date: string | Date) {
    try {
        return new Date(date);
    } catch (error) {
        return null;
    }
}

export function DateToISOStr(date: string | Date): string | null {
    try {
        return new Date(date).toISOString();
    } catch (error) {
        return null;
    }
}

interface FormatDateOptions {
    locale?: string;
    includeTime?: boolean;
    shortMonthNames?: boolean;
    utc?: boolean;
}

export function FormatDate_ToLocaleString(_date: string | Date, _options: FormatDateOptions = {}) {
    const date = DateFromStr(_date);
    if (!date) return "";

    const options: Intl.DateTimeFormatOptions = {
        year: "numeric",
        month: "long",
        day: "numeric",
    };

    if (_options.includeTime !== false) {
        options.hour = "numeric";
        options.minute = "numeric";
    }

    if (_options.shortMonthNames === true) {
        options.month = "short";
    }

    if (_options.utc === true) {
        options.timeZone = "UTC";
    }

    return date.toLocaleString(_options.locale, options);
}
