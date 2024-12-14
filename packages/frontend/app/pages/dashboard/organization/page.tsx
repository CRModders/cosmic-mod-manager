import { imageUrl } from "@root/utils";
import { OrgPagePath } from "@root/utils/urls";
import type { Organisation } from "@shared/types/api";
import { PlusIcon } from "lucide-react";
import { OrgListItemCard } from "~/components/item-card";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { FullWidthSpinner } from "~/components/ui/spinner";
import { useSession } from "~/hooks/session";
import { useTranslation } from "~/locales/provider";
import CreateNewOrg_Dialog from "./new-organization";

interface Props {
    organisations: Organisation[];
}

export default function OrganisationDashboardPage({ organisations }: Props) {
    const { t } = useTranslation();
    const session = useSession();

    return (
        <Card className="w-full overflow-hidden">
            <CardHeader className="w-full flex flex-row flex-wrap items-center justify-between gap-x-6 gap-y-2">
                <CardTitle>{t.dashboard.organizations}</CardTitle>

                <CreateNewOrg_Dialog>
                    <Button>
                        <PlusIcon className="w-btn-icon-md h-btn-icon-md" />
                        {t.dashboard.createAnOrg}
                    </Button>
                </CreateNewOrg_Dialog>
            </CardHeader>
            <CardContent>
                {!organisations?.length && <p className="text-muted-foreground">{t.dashboard.createAnOrg}</p>}
                {organisations === undefined ? (
                    <FullWidthSpinner />
                ) : (
                    <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
                        {organisations?.map((org) => {
                            if (org.members.find((member) => member.userId === session?.id)?.accepted === false) return;

                            return (
                                <OrgListItemCard
                                    vtId={org.id}
                                    key={org.id}
                                    title={org.name}
                                    url={OrgPagePath(org.slug)}
                                    icon={imageUrl(org.icon)}
                                    description={org.description || ""}
                                    members={org.members.length}
                                />
                            );
                        })}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
