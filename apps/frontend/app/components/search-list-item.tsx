import DefaultSearchListItem from "@app/components/misc/search-list-item";
import { FormatCount } from "@app/utils/number";
import type React from "react";
import { useRootData } from "~/hooks/root-data";
import { formatLocaleCode } from "~/locales";
import { useTranslation } from "~/locales/provider";
import { OrgPagePath, ProjectPagePath, UserProfilePath } from "~/utils/urls";
import { TimePassedSince } from "./ui/date";

export { ViewType } from "@app/components/misc/search-list-item";

type Props = Omit<
    React.ComponentProps<typeof DefaultSearchListItem>,
    "t" | "ProjectPagePath" | "OrgPagePath" | "UserProfilePath" | "viewTransitions" | "TimeSince_Fn" | "NumberFormatter"
>;

export default function SearchListItem(props: Props) {
    const viewTransitions = useRootData()?.viewTransitions !== false;
    const { t, locale } = useTranslation();

    return (
        <DefaultSearchListItem
            {...props}
            t={t}
            UserProfilePath={UserProfilePath}
            ProjectPagePath={ProjectPagePath}
            OrgPagePath={OrgPagePath}
            viewTransitions={viewTransitions}
            TimeSince_Fn={(date: string | Date) => {
                return TimePassedSince({ date: date });
            }}
            NumberFormatter={(num: number) => {
                return FormatCount(num, formatLocaleCode(locale));
            }}
        />
    );
}
