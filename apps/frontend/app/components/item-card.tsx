import { OrgListItemCard as DefaultOrgListItemCard } from "@app/components/misc/item-card";
import type React from "react";
import { useRootData } from "~/hooks/root-data";
import { useTranslation } from "~/locales/provider";

type OrgListItemCardProps = Omit<React.ComponentProps<typeof DefaultOrgListItemCard>, "t" | "viewTransitions">;

export function OrgListItemCard(props: OrgListItemCardProps) {
    const viewTransitions = useRootData()?.userConfig.viewTransitions !== false;
    const { t } = useTranslation();

    return <DefaultOrgListItemCard {...props} t={t} viewTransitions={viewTransitions} />;
}
