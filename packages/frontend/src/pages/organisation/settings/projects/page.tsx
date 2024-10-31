import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SITE_NAME_SHORT } from "@shared/config";
import { Helmet } from "react-helmet";

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import CreateNewProjectDialog from "@/src/pages/dashboard/projects/new-project";
import { ProjectsListTable } from "@/src/pages/dashboard/projects/page";
import { BadgeInfoIcon } from "lucide-react";
import { useContext } from "react";
import { invalidateOrgProjectsQuery } from "../../_loader";
import { orgDataContext } from "../../org-context";

const OrgProjectsSettings = () => {
    const { orgData, projects } = useContext(orgDataContext);

    return (
        <>
            <Helmet>
                <title>Projects | {SITE_NAME_SHORT}</title>
                <meta name="description" content={`Your ${SITE_NAME_SHORT} projects`} />
            </Helmet>

            <Card className="w-full overflow-hidden">
                <CardHeader className="w-full flex flex-row flex-wrap items-start justify-between gap-x-6 gap-y-2">
                    <CardTitle>Projects</CardTitle>
                    <div className="flex items-center justify-center gap-3">
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <BadgeInfoIcon className="w-btn-icon-md h-btn-icon-md text-muted-foreground" />
                                </TooltipTrigger>
                                <TooltipContent className="max-w-md">
                                    You can transfer your existing projects to this organisation from Project settings &gt; Members
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>

                        <CreateNewProjectDialog
                            orgId={orgData?.id}
                            invalidateProjectsData={async () => invalidateOrgProjectsQuery(orgData?.slug || "")}
                        />
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    {projects?.length === 0 ? (
                        <div className="w-full flex items-center justify-start p-6">
                            <p>You don't have any projects. Click the button above to create one.</p>
                        </div>
                    ) : (projects?.length || 0) > 0 ? (
                        <ProjectsListTable projects={projects || []} />
                    ) : null}
                </CardContent>
            </Card>
        </>
    );
};

export const Component = OrgProjectsSettings;
