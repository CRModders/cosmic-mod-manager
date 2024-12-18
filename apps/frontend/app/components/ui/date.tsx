import { formatDate, timeSince } from "@app/utils/date";
import { Capitalize } from "@app/utils/string";
import ClientOnly from "~/components/client-only";
import { useTranslation } from "~/locales/provider";

interface FormatDateProps {
    date: Date | string;
    timestamp_template?: string;
    useShortMonthNames?: boolean;
}

export function FormattedDate(props: FormatDateProps) {
    const date = new Date(props.date);

    return (
        <ClientOnly
            fallback={formatDate(date, props.timestamp_template, props.useShortMonthNames, true)}
            Element={() => <>{formatDate(date, props.timestamp_template, props.useShortMonthNames)}</>}
        />
    );
}

interface TimePassedSinceProps {
    date: Date | string;
    capitalize?: boolean;
}

export function TimePassedSince(props: TimePassedSinceProps) {
    const { t } = useTranslation();
    const date = new Date(props.date);

    const timeStr = timeSince(date, t.date);
    if (props.capitalize) return Capitalize(timeStr);
    return timeStr;
}
