import { FormatCount } from "@app/utils/number";
import { formatLocaleCode } from "~/locales";
import { useTranslation } from "~/locales/provider";

interface FormattedCountProps {
    count: number;
    notation?: Intl.NumberFormatOptions["notation"];
}

export function FormattedCount({ count, notation = "compact" }: FormattedCountProps) {
    const { locale } = useTranslation();

    return FormatCount(count, formatLocaleCode(locale), { notation: notation });
}
