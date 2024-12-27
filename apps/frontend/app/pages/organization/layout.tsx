import { CubeIcon, fallbackOrgIcon } from "@app/components/icons";
import { MicrodataItemType, itemType } from "@app/components/microdata";
import RefreshPage from "@app/components/misc/refresh-page";
import { Button } from "@app/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@app/components/ui/card";
import { PopoverClose } from "@app/components/ui/popover";
import { Separator } from "@app/components/ui/separator";
import { isModerator } from "@app/utils/config/roles";
import { getProjectTypesFromNames } from "@app/utils/convertors";
import type { LoggedInUserData, ProjectType } from "@app/utils/types";
import type { Organisation, TeamMember } from "@app/utils/types/api";
import { imageUrl } from "@app/utils/url";
import { Building2Icon, ClipboardCopyIcon, DownloadIcon, SettingsIcon, UsersIcon } from "lucide-react";
import { Outlet, useLocation } from "react-router";
import { PageHeader } from "~/components/page-header";
import { VariantButtonLink, useNavigate } from "~/components/ui/link";
import { useOrgData } from "~/hooks/org";
import { useSession } from "~/hooks/session";
import { useTranslation } from "~/locales/provider";
import { OrgPagePath } from "~/utils/urls";
import TeamInvitationBanner from "../project/join-project-banner";
import { ProjectMember } from "../project/layout";
import SecondaryNav from "../project/secondary-nav";

export default function OrgPageLayout() {
    const { t } = useTranslation();
    const session = useSession();
    const ctx = useOrgData();
    const projects = ctx.orgProjects;
    const orgData = ctx.orgData;

    const navigate = useNavigate();
    const location = useLocation();

    const aggregatedDownloads = (projects || []).reduce((acc, project) => acc + project.downloads, 0) || 0;
    const totalProjects = (projects || []).length;
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
        <main className="org-page-layout pb-12 gap-panel-cards" itemScope itemType={itemType(MicrodataItemType.Organization)}>
            <OrgInfoHeader
                session={session}
                orgData={orgData}
                currUsersMembership={ctx.currUsersMembership}
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
                        urlBase={OrgPagePath(orgData.slug)}
                        links={[
                            { label: t.common.all, href: "" },
                            ...getProjectTypesFromNames(projectTypesList).map((type: ProjectType) => ({
                                label: t.navbar[`${type}s`],
                                href: `/${type}s`,
                            })),
                        ]}
                    />
                ) : null}

                {totalProjects ? (
                    <Outlet />
                ) : (
                    <div className="w-full flex items-center justify-center py-12">
                        <p className="text-lg text-muted-foreground italic text-center">{t.organization.orgDoesntHaveProjects}</p>
                    </div>
                )}
            </div>
            <PageSidebar members={orgData.members} />
        </main>
    );
}

function PageSidebar({ members }: { members: TeamMember[] }) {
    const { t } = useTranslation();

    return (
        <aside
            style={{
                gridArea: "sidebar",
            }}
            className="w-full flex flex-col gap-panel-cards"
        >
            <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="text-lg ">{t.projectSettings.members}</CardTitle>
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
    session: LoggedInUserData | null;
    totalProjects: number;
    totalDownloads: number;
    orgData: Organisation;
    currUsersMembership: TeamMember | null;
    fetchOrgData: () => Promise<void>;
}

function OrgInfoHeader({ session, orgData, totalProjects, totalDownloads, currUsersMembership, fetchOrgData }: OrgInfoHeaderProps) {
    const { t } = useTranslation();
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
                        {t.project.organization}
                    </div>
                }
                threeDotMenu={
                    <>
                        {currUsersMembership?.id || isModerator(session?.role) ? (
                            <>
                                <VariantButtonLink
                                    variant="ghost"
                                    url={OrgPagePath(orgData.slug, "settings/projects")}
                                    prefetch="render"
                                    size="sm"
                                >
                                    <CubeIcon className="w-btn-icon-md h-btn-icon-md" />
                                    {t.organization.manageProjects}
                                </VariantButtonLink>

                                <Separator />
                            </>
                        ) : null}

                        <PopoverClose asChild>
                            <Button
                                className="w-full justify-start"
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                    navigator.clipboard.writeText(orgData.id);
                                }}
                            >
                                <ClipboardCopyIcon className="w-btn-icon h-btn-icon" />
                                {t.common.copyId}
                            </Button>
                        </PopoverClose>
                    </>
                }
                actionBtns={
                    currUsersMembership?.id || isModerator(session?.role) ? (
                        <VariantButtonLink variant="secondary-inverted" url={OrgPagePath(orgData.slug, "settings")}>
                            <SettingsIcon className="w-btn-icon h-btn-icon" />
                            {t.dashboard.manage}
                        </VariantButtonLink>
                    ) : null
                }
            >
                <div className="flex items-center gap-2 border-0 border-r border-card-background dark:border-shallow-background pr-4">
                    <UsersIcon className="w-[1.1rem] h-[1.1rem]" />
                    <span className="font-semibold">{t.organization.membersCount(orgData.members.length)}</span>
                </div>
                <div className="flex items-center gap-2 border-0 border-r border-card-background dark:border-shallow-background pr-4">
                    <CubeIcon className="w-btn-icon-md h-btn-icon-md" />
                    <span className="font-semibold">{t.user.projectsCount(totalProjects)}</span>
                </div>
                <div className="flex items-center gap-2 pr-4">
                    <DownloadIcon className="w-btn-icon-md h-btn-icon-md" />
                    <span className="font-semibold">{t.user.downloads(`${totalDownloads}`)}</span>
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
