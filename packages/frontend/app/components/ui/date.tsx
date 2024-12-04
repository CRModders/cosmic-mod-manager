import { formatDate, timeSince } from "@root/utils";
import ClientOnly from "../client-only";

interface FormatDateProps {
    date: Date | string;
    timestamp_template?: string;
    useShortMonthNames?: boolean;
}

export function FormattedDate(props: FormatDateProps) {
    const date = new Date(props.date);
    return (
        <ClientOnly
            fallback={date.toUTCString()}
            Element={() => <>{formatDate(date, props.timestamp_template, props.useShortMonthNames)}</>}
        />
    );
}

export function TimePassedSince({ date }: { date: Date | string }) {
    const _date = new Date(date);

    return <ClientOnly fallback={_date.toUTCString()} Element={() => <>{timeSince(_date)}</>} />;
}
