import { useLocation, useNavigate } from "@remix-run/react";
import { getOrgPagePathname, imageUrl } from "@root/utils";
import clientFetch from "@root/utils/client-fetch";
import { disableInteractions, enableInteractions } from "@root/utils/dom";
import type { Organisation, TeamMember } from "@shared/types/api";
import { Building2Icon, CheckIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { OrgListItemCard } from "~/components/item-card";
import RefreshPage from "~/components/refresh-page";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { LoadingSpinner } from "~/components/ui/spinner";

interface Props {
    organisations: Organisation[];
    projectId: string;
}

export function TransferProjectManagementCard({ organisations, projectId }: Props) {
    const [isLoading, setIsLoading] = useState(false);
    const [selectedOrg, setSelectedOrg] = useState<undefined | string>(undefined);
    const navigate = useNavigate();
    const location = useLocation();

    const transferProject = async () => {
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
    };

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Organization</CardTitle>
            </CardHeader>
            <CardContent className="w-full flex flex-col gap-4">
                <CardDescription className="max-w-[80ch] leading-tight">
                    This project is not managed by an organization. If you are the member of any organizations, you can transfer management
                    to one of them.
                </CardDescription>

                <div className="w-full flex flex-wrap gap-3">
                    <Select value={selectedOrg} onValueChange={setSelectedOrg}>
                        <SelectTrigger className="w-fit gap-2 min-w-full sm:min-w-[42ch]">
                            <SelectValue placeholder="Select organization" />
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
                        Transfer management
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
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const removeProjectFromOrg = async () => {
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
    };

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Organization</CardTitle>
            </CardHeader>
            <CardContent className="w-full flex flex-col gap-4">
                <CardDescription className="max-w-[80ch] leading-tight">
                    This project is managed by {org.name}. The defaults for member permissions are set in the organization settings. You may
                    override them below.
                </CardDescription>

                <div className="w-full flex flex-wrap gap-3">
                    <div className="w-full">
                        <OrgListItemCard
                            vtId={org.id}
                            title={org.name}
                            url={getOrgPagePathname(org.slug)}
                            icon={imageUrl(org.icon)}
                            description={org.description || ""}
                            members={org.members.length}
                            className="p-6"
                        />
                    </div>

                    <Button onClick={removeProjectFromOrg} variant="secondary">
                        {isLoading ? <LoadingSpinner size="xs" /> : <Building2Icon className="w-btn-icon-md h-btn-icon-md" />}
                        Remove from organization
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
