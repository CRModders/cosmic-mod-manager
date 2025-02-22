export function timeSince(pastTime: Date, locale = "en-US"): string {
    try {
        const formatter = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });
        const now = new Date();
        const diff = now.getTime() - pastTime.getTime();

        const seconds = Math.round(diff / 1000);
        if (seconds < 60) return formatter.format(-seconds, "second");

        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return formatter.format(-minutes, "minute");

        const hours = Math.floor(minutes / 60);
        if (hours < 24) return formatter.format(-hours, "hour");

        const days = Math.round(hours / 24);
        if (days < 7) return formatter.format(-days, "day");

        const weeks = Math.round(days / 7);
        if (weeks < 4) return formatter.format(-weeks, "week");

        const months = Math.round(days / 30.4375);
        if (months < 12) return formatter.format(-months, "month");

        const years = Math.round(days / 365.25);
        return formatter.format(-years, "year");
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

export function GetTimestamp() {
    const now = new Date();
    const month = `${now.getMonth() + 1}`.padStart(2, "0");
    return `${now.getFullYear()}-${month}-${now.getDate()} ${now.getHours()}:${now.getMinutes()}`;
}
