import { OrgListItemCard as DefaultOrgListItemCard } from "@app/components/misc/item-card";
import type React from "react";
import { useTranslation } from "~/locales/provider";

export { ListItemCard } from "@app/components/misc/item-card";

type OrgListItemCardProps = Omit<React.ComponentProps<typeof DefaultOrgListItemCard>, "t">;

export function OrgListItemCard(props: OrgListItemCardProps) {
    const { t } = useTranslation();

    return <DefaultOrgListItemCard {...props} t={t} />;
}
