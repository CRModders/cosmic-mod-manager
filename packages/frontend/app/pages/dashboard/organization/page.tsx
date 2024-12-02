import { getOrgPagePathname, imageUrl } from "@root/utils";
import type { LoggedInUserData } from "@shared/types";
import type { Organisation } from "@shared/types/api";
import { PlusIcon } from "lucide-react";
import ClientOnly from "~/components/client-only";
import { OrgListItemCard } from "~/components/item-card";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { FullWidthSpinner } from "~/components/ui/spinner";
import CreateNewOrg_Dialog from "./new-organization";

interface Props {
    organisations: Organisation[];
    session: LoggedInUserData;
}

export default function OrganisationDashboardPage({ organisations, session }: Props) {
    return (
        <Card className="w-full overflow-hidden">
            <CardHeader className="w-full flex flex-row flex-wrap items-center justify-between gap-x-6 gap-y-2">
                <CardTitle>Organizations</CardTitle>

                <ClientOnly
                    fallback={
                        <Button>
                            <PlusIcon className="w-btn-icon-md h-btn-icon-md" />
                            Create organization
                        </Button>
                    }
                    Element={() => (
                        <CreateNewOrg_Dialog>
                            <Button>
                                <PlusIcon className="w-btn-icon-md h-btn-icon-md" />
                                Create organization
                            </Button>
                        </CreateNewOrg_Dialog>
                    )}
                />
            </CardHeader>
            <CardContent>
                {!organisations?.length && <p className="text-muted-foreground">Create an organization!</p>}
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
                                    url={getOrgPagePathname(org.slug)}
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
