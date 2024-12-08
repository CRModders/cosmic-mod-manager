import { PopoverClose } from "@radix-ui/react-popover";
import { Outlet, useLocation, useNavigate, useOutletContext } from "@remix-run/react";
import { getOrgPagePathname, imageUrl } from "@root/utils";
import { CapitalizeAndFormatString } from "@shared/lib/utils";
import { getProjectTypesFromNames } from "@shared/lib/utils/convertors";
import type { Organisation, TeamMember } from "@shared/types/api";
import { Building2Icon, ClipboardCopyIcon, DownloadIcon, SettingsIcon, UsersIcon } from "lucide-react";
import { CubeIcon, fallbackOrgIcon } from "~/components/icons";
import { PageHeader } from "~/components/layout/page-header";
import RefreshPage from "~/components/refresh-page";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { VariantButtonLink } from "~/components/ui/link";
import { Separator } from "~/components/ui/separator";
import type { OrgDataContext } from "~/routes/organization/data-wrapper";
import TeamInvitationBanner from "../project/join-project-banner";
import { ProjectMember } from "../project/layout";
import SecondaryNav from "../project/secondary-nav";
import "./styles.css";

export default function OrgPageLayout() {
    const { orgData, orgProjects: projects, currUsersMembership } = useOutletContext<OrgDataContext>();
    const navigate = useNavigate();
    const location = useLocation();

    const aggregatedDownloads = projects?.reduce((acc, project) => acc + project.downloads, 0) || 0;
    const totalProjects = projects?.length || 0;
    const aggregatedProjectTypes = new Set<string>();
    for (const project of projects || []) {
        for (const type of project.type) {
            aggregatedProjectTypes.add(type);
        }
    }
    const projectTypesList = Array.from(aggregatedProjectTypes);

    async function refreshOrgData() {
        RefreshPage(navigate, location);
    }

    return (
        <main className="org-page-layout pb-12 gap-panel-cards">
            <OrgInfoHeader
                orgData={orgData}
                currUsersMembership={currUsersMembership}
                totalDownloads={aggregatedDownloads}
                totalProjects={totalProjects}
                fetchOrgData={refreshOrgData}
            />

            <div
                className="h-fit grid grid-cols-1 gap-panel-cards"
                style={{
                    gridArea: "content",
                }}
            >
                {projectTypesList?.length > 1 && totalProjects > 1 ? (
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

                {totalProjects ? (
                    <Outlet
                        context={
                            {
                                orgData: orgData,
                                orgProjects: projects,
                                currUsersMembership: currUsersMembership,
                            } satisfies OrgDataContext
                        }
                    />
                ) : (
                    <div className="w-full flex items-center justify-center py-12">
                        <p className="text-lg text-muted-foreground italic text-center">This organization doesn't have any projects yet.</p>
                    </div>
                )}
            </div>
            <PageSidebar members={orgData.members} />
        </main>
    );
}

function PageSidebar({ members }: { members: TeamMember[] }) {
    return (
        <aside
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
                                vtId={member.userId}
                                key={member.id}
                                userName={member.userName}
                                isOwner={member.isOwner}
                                roleName={member.role}
                                avatarImageUrl={imageUrl(member.avatar)}
                            />
                        );
                    })}
                </CardContent>
            </Card>
        </aside>
    );
}

interface OrgInfoHeaderProps {
    totalProjects: number;
    totalDownloads: number;
    orgData: Organisation;
    currUsersMembership: TeamMember | null;
    fetchOrgData: () => Promise<void>;
}

function OrgInfoHeader({ orgData, totalProjects, totalDownloads, currUsersMembership, fetchOrgData }: OrgInfoHeaderProps) {
    return (
        <div className="w-full flex flex-col [grid-area:_header] gap-1">
            <PageHeader
                vtId={orgData.id}
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
                            <>
                                <VariantButtonLink
                                    variant="ghost"
                                    url={getOrgPagePathname(orgData.slug, "/settings/projects")}
                                    prefetch="render"
                                >
                                    <CubeIcon className="w-btn-icon-md h-btn-icon-md" />
                                    Manage projects
                                </VariantButtonLink>
                                <Separator className="my-0.5" />
                            </>
                        ) : null}
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
                <div className="flex items-center gap-2 pr-4">
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
}
