import DefaultSearchListItem from "@app/components/misc/search-list-item";
import type React from "react";
import { useTranslation } from "~/locales/provider";
import { OrgPagePath, ProjectPagePath, UserProfilePath } from "~/utils/urls";

export { ViewType } from "@app/components/misc/search-list-item";

type Props = Omit<React.ComponentProps<typeof DefaultSearchListItem>, "t" | "ProjectPagePath" | "OrgPagePath" | "UserProfilePath">;

export default function SearchListItem(props: Props) {
    const { t } = useTranslation();

    return (
        <DefaultSearchListItem
            {...props}
            t={t}
            UserProfilePath={UserProfilePath}
            ProjectPagePath={ProjectPagePath}
            OrgPagePath={OrgPagePath}
        />
    );
}
