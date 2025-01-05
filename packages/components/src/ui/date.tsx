import { FormatDate_ToLocaleString, timeSince } from "@app/utils/date";

interface FormatDateProps {
    date: Date | string;
    shortMonthNames?: boolean;
    showTime?: boolean;
    utc?: boolean;
    locale?: string;
}

export function FormattedDate(props: FormatDateProps) {
    return FormatDate_ToLocaleString(props.date, {
        includeTime: props.showTime,
        shortMonthNames: props.shortMonthNames,
        utc: props.utc,
        locale: props.locale,
    });
}

export function TimePassedSince({ date }: { date: Date | string }) {
    const _date = new Date(date);

    return timeSince(_date);
}
