import { CubeIcon, fallbackOrgIcon } from "@/components/icons";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { VariantButtonLink } from "@/components/ui/link";
import { Separator } from "@/components/ui/separator";
import { getOrgPagePathname, imageUrl } from "@/lib/utils";
import { PopoverClose } from "@radix-ui/react-popover";
import { SITE_NAME_SHORT } from "@shared/config";
import { CapitalizeAndFormatString } from "@shared/lib/utils";
import { getProjectTypesFromNames } from "@shared/lib/utils/convertors";
import type { Organisation, TeamMember } from "@shared/types/api";
import { Building2Icon, ClipboardCopyIcon, DownloadIcon, SettingsIcon, UsersIcon } from "lucide-react";
import { useContext } from "react";
import { Helmet } from "react-helmet";
import { useParams } from "react-router-dom";
import TeamInvitationBanner from "../project/join-project-banner";
import { ProjectMember } from "../project/layout";
import SecondaryNav from "../project/secondary-nav";
import { orgDataContext } from "./org-context";
import OrgProjectsList from "./page";
import "./styles.css";

const OrgPageLayout = () => {
    const { projectType } = useParams();
    const { orgData, projects, currUsersMembership, fetchOrgData } = useContext(orgDataContext);

    if (!orgData) return null;

    const aggregatedDownloads = projects?.reduce((acc, project) => acc + project.downloads, 0) || 0;
    const totalProjects = projects?.length || 0;
    const aggregatedProjectTypes = new Set<string>();
    for (const project of projects || []) {
        for (const type of project.type) {
            aggregatedProjectTypes.add(type);
        }
    }
    const projectTypesList = Array.from(aggregatedProjectTypes);

    return (
        <>
            <Helmet>
                <title>
                    {orgData.name || ""} | {SITE_NAME_SHORT}
                </title>
                <meta name="description" content={`${orgData.name} organization`} />
            </Helmet>

            <div className="org-page-layout pb-12 gap-panel-cards">
                <OrgInfoHeader
                    orgData={orgData}
                    currUsersMembership={currUsersMembership}
                    totalDownloads={aggregatedDownloads}
                    totalProjects={totalProjects}
                    fetchOrgData={fetchOrgData}
                />

                <div
                    className="flex items-start justify-start flex-col gap-panel-cards"
                    style={{
                        gridArea: "content",
                    }}
                >
                    {projectTypesList?.length > 1 ? (
                        <SecondaryNav
                            className="bg-card-background rounded-lg px-3 py-2"
                            urlBase={getOrgPagePathname(orgData.slug)}
                            links={[
                                { label: "All", href: "" },
                                ...getProjectTypesFromNames(projectTypesList).map((type) => ({
                                    label: `${CapitalizeAndFormatString(type)}s` || "",
                                    href: `/${type}s`,
                                })),
                            ]}
                        />
                    ) : null}

                    {projects?.length ? (
                        <OrgProjectsList projectType={projectType} projectsList={projects} />
                    ) : (
                        <div className="w-full flex items-center justify-center py-12">
                            <p className="text-lg text-muted-foreground italic">This organization doesn't have any projects yet.</p>
                        </div>
                    )}
                </div>
                <PageSidebar members={orgData.members} />
            </div>
        </>
    );
};

export const Component = OrgPageLayout;

const PageSidebar = ({ members }: { members: TeamMember[] }) => {
    return (
        <div
            style={{
                gridArea: "sidebar",
            }}
            className="w-full flex flex-col gap-panel-cards"
        >
            <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="text-lg ">Members</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-1">
                    {members.map((member) => {
                        if (!member.accepted) return null;

                        return (
                            <ProjectMember
                                key={member.id}
                                userName={member.userName}
                                isOwner={member.isOwner}
                                roleName={member.role}
                                avatarImageUrl={imageUrl(member.avatarUrl)}
                            />
                        );
                    })}
                </CardContent>
            </Card>
        </div>
    );
};

interface OrgInfoHeaderProps {
    totalProjects: number;
    totalDownloads: number;
    orgData: Organisation;
    currUsersMembership: TeamMember | null;
    fetchOrgData: () => Promise<void>;
}

const OrgInfoHeader = ({ orgData, totalProjects, totalDownloads, currUsersMembership, fetchOrgData }: OrgInfoHeaderProps) => {
    return (
        <div className="w-full flex flex-col [grid-area:_header] gap-1">
            <PageHeader
                icon={imageUrl(orgData.icon)}
                iconClassName="rounded"
                fallbackIcon={fallbackOrgIcon}
                title={orgData.name}
                description={orgData.description || ""}
                titleBadge={
                    <div className="ml-2 flex items-center justify-center gap-1.5 font-bold text-extra-muted-foreground">
                        <Building2Icon className="w-btn-icon h-btn-icon" />
                        Organization
                    </div>
                }
                threeDotMenu={
                    <>
                        {currUsersMembership?.id ? (
                            <VariantButtonLink variant="ghost" url={getOrgPagePathname(orgData.slug, "/settings/projects")}>
                                <CubeIcon className="w-btn-icon-md h-btn-icon-md" />
                                Manage projects
                            </VariantButtonLink>
                        ) : null}
                        <Separator className="my-0.5" />
                        <PopoverClose asChild>
                            <Button
                                className="w-full justify-start"
                                variant="ghost"
                                onClick={() => {
                                    navigator.clipboard.writeText(orgData.id);
                                }}
                            >
                                <ClipboardCopyIcon className="w-btn-icon h-btn-icon" />
                                Copy ID
                            </Button>
                        </PopoverClose>
                    </>
                }
                actionBtns={
                    currUsersMembership?.id ? (
                        <VariantButtonLink variant="secondary-inverted" url={getOrgPagePathname(orgData.slug, "/settings")}>
                            <SettingsIcon className="w-btn-icon h-btn-icon" />
                            Manage
                        </VariantButtonLink>
                    ) : null
                }
            >
                <div className="flex items-center gap-2 border-0 border-r border-card-background dark:border-shallow-background pr-4">
                    <UsersIcon className="w-[1.1rem] h-[1.1rem]" />
                    <span className="font-semibold">
                        {orgData.members.length} {orgData.members.length > 1 ? "Members" : "Member"}
                    </span>
                </div>
                <div className="flex items-center gap-2 border-0 border-r border-card-background dark:border-shallow-background pr-4">
                    <CubeIcon className="w-btn-icon-md h-btn-icon-md" />
                    <span className="font-semibold">
                        {totalProjects} {totalProjects > 1 ? "Projects" : "Project"}
                    </span>
                </div>
                <div className="flex items-center gap-2 border-0 border-r border-card-background dark:border-shallow-background pr-4">
                    <DownloadIcon className="w-btn-icon-md h-btn-icon-md" />
                    <span className="font-semibold">{totalDownloads} downloads</span>
                </div>
            </PageHeader>

            {currUsersMembership && currUsersMembership?.accepted !== true ? (
                <TeamInvitationBanner
                    refreshData={fetchOrgData}
                    role={currUsersMembership.role}
                    teamId={currUsersMembership.teamId}
                    isOrg
                />
            ) : null}
        </div>
    );
};
