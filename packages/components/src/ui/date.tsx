import { formatDate, timeSince } from "@app/utils/date";

interface FormatDateProps {
    date: Date | string;
    timestamp_template?: string;
    useShortMonthNames?: boolean;
}

export function FormattedDate(props: FormatDateProps) {
    const date = new Date(props.date);
    return formatDate(date, props.timestamp_template, props.useShortMonthNames);
}

export function TimePassedSince({ date }: { date: Date | string }) {
    const _date = new Date(date);

    return timeSince(_date);
}
