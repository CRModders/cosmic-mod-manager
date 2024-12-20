import DefaultSearchListItem from "@app/components/misc/search-list-item";
import type React from "react";
import { useRootData } from "~/hooks/root-data";
import { useTranslation } from "~/locales/provider";
import { OrgPagePath, ProjectPagePath, UserProfilePath } from "~/utils/urls";

export { ViewType } from "@app/components/misc/search-list-item";

type Props = Omit<
    React.ComponentProps<typeof DefaultSearchListItem>,
    "t" | "ProjectPagePath" | "OrgPagePath" | "UserProfilePath" | "viewTransitions"
>;

export default function SearchListItem(props: Props) {
    const viewTransitions = useRootData()?.viewTransitions !== false;
    const { t } = useTranslation();

    return (
        <DefaultSearchListItem
            {...props}
            t={t}
            UserProfilePath={UserProfilePath}
            ProjectPagePath={ProjectPagePath}
            OrgPagePath={OrgPagePath}
            viewTransitions={viewTransitions}
        />
    );
}