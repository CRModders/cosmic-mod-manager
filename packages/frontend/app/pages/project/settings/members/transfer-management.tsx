import { imageUrl } from "@root/utils";
import clientFetch from "@root/utils/client-fetch";
import { disableInteractions, enableInteractions } from "@root/utils/dom";
import { OrgPagePath } from "@root/utils/urls";
import type { Organisation, TeamMember } from "@shared/types/api";
import { Building2Icon, CheckIcon } from "lucide-react";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { toast } from "sonner";
import { OrgListItemCard } from "~/components/item-card";
import RefreshPage from "~/components/refresh-page";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { LoadingSpinner } from "~/components/ui/spinner";
import { useTranslation } from "~/locales/provider";

interface Props {
    organisations: Organisation[];
    projectId: string;
}

export function TransferProjectManagementCard({ organisations, projectId }: Props) {
    const { t } = useTranslation();
    const [isLoading, setIsLoading] = useState(false);
    const [selectedOrg, setSelectedOrg] = useState<undefined | string>(undefined);
    const navigate = useNavigate();
    const location = useLocation();

    async function transferProject() {
        try {
            if (isLoading || !selectedOrg) return;
            setIsLoading(true);
            disableInteractions();

            const res = await clientFetch(`/api/organization/${selectedOrg}/projects`, {
                method: "POST",
                body: JSON.stringify({ projectId: projectId }),
            });
            const data = await res.json();

            if (!res.ok || !data.success) {
                enableInteractions();
                return toast.error(data.message || "Error");
            }

            RefreshPage(navigate, location);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>{t.project.organization}</CardTitle>
            </CardHeader>
            <CardContent className="w-full flex flex-col gap-4">
                <CardDescription className="max-w-[80ch] leading-tight">{t.projectSettings.projectNotManagedByOrg}</CardDescription>

                <div className="w-full flex flex-wrap gap-3">
                    <Select value={selectedOrg} onValueChange={setSelectedOrg}>
                        <SelectTrigger className="w-fit gap-2 min-w-full sm:min-w-[42ch]">
                            <SelectValue placeholder={t.projectSettings.selectOrg} />
                        </SelectTrigger>
                        <SelectContent>
                            {organisations.map((organisation) => (
                                <SelectItem key={organisation.id} value={organisation.id}>
                                    {organisation.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Button disabled={!selectedOrg} onClick={transferProject}>
                        {isLoading ? <LoadingSpinner size="xs" /> : <CheckIcon className="w-btn-icon-md h-btn-icon-md" />}
                        {t.projectSettings.transferManagementToOrg}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}

interface RemoveProjectFromOrgProps {
    projectId: string;
    org: { id: string; name: string; slug: string; icon: string | null; description: string | null; members: TeamMember[] };
}

export function RemoveProjectFromOrg({ org, projectId }: RemoveProjectFromOrgProps) {
    const { t } = useTranslation();
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    async function removeProjectFromOrg() {
        try {
            if (isLoading) return;
            setIsLoading(true);
            disableInteractions();

            const res = await clientFetch(`/api/organization/${org.id}/project/${projectId}`, {
                method: "DELETE",
            });
            const data = await res.json();

            if (!res.ok || !data.success) {
                enableInteractions();
                return toast.error(data.message || "Error");
            }

            RefreshPage(navigate, location);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>{t.project.organization}</CardTitle>
            </CardHeader>
            <CardContent className="w-full flex flex-col gap-4">
                <CardDescription className="max-w-[80ch] leading-tight">{t.projectSettings.projectManagedByOrg(org.name)}</CardDescription>

                <div className="w-full flex flex-wrap gap-3">
                    <div className="w-full">
                        <OrgListItemCard
                            vtId={org.id}
                            title={org.name}
                            url={OrgPagePath(org.slug)}
                            icon={imageUrl(org.icon)}
                            description={org.description || ""}
                            members={org.members.length}
                            className="p-6"
                        />
                    </div>

                    <Button onClick={removeProjectFromOrg} variant="secondary">
                        {isLoading ? <LoadingSpinner size="xs" /> : <Building2Icon className="w-btn-icon-md h-btn-icon-md" />}
                        {t.projectSettings.removeFromOrg}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
